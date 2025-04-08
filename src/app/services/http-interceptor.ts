import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, finalize, throwError ,catchError, switchMap, filter, take, BehaviorSubject, tap, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SessionTimeoutService } from './session-timeout.service';
import { AuthGuardService } from './auth-guard.service';
import { LoginService } from './login.service';

 
@Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private jwtHelper = new JwtHelperService();
//   constructor(private route: ActivatedRoute,private sessionService: SessionTimeoutService , private loginservice: LoginService,) {}
  
//   intercept( req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
//     let auth_token = localStorage.getItem('access_token');
//     let url_token = localStorage.getItem('url_token');
//     if (url_token) {
//       auth_token = url_token;
//     }
//     if (auth_token && !this.jwtHelper.isTokenExpired(auth_token)) {
//       const authReq = req.clone({
//         headers: req.headers.set('Authorization', Bearer ${auth_token}),
//       });
//       return next.handle(authReq);
//     }
 
//      // If token is expired, attempt silent refresh
//      if (auth_token && !url_token && this.jwtHelper.isTokenExpired(auth_token)) {
//       let data = {
//         Access_Token: localStorage.getItem('access_token'),
//         Referesh_Token : localStorage.getItem('refresh_token'),         
//       }
//       this.loginservice.refreshToken(data).subscribe({
//         next: (response: any) => {
//           const newAccessToken = response.str_Message;
//           const newRefreshToken = response.Referesh_Token;
//           if (newAccessToken) {
//             localStorage.setItem('access_token', newAccessToken);
//           localStorage.setItem('refresh_token', newRefreshToken);   
//             const refreshedReq = req.clone({
//               headers: req.headers.set('Authorization', Bearer ${newAccessToken}),
//             });
//             return next.handle(refreshedReq);
//           } else {
//             localStorage.removeItem('access_token');
//             localStorage.removeItem("refresh_token"); 
//             // Notify session expired if refresh fails
//             this.sessionService.notifySessionExpired();
//             return throwError(() =>
//               new HttpErrorResponse({
//                 status: 401,
//                 statusText: 'Login Token Expired',
//                 error: { message: 'Your session has expired.' },
//               })
//             );
//           }
          
//         },
//         error: (error: any) => {              
//             this.sessionService.notifySessionExpired();
//             return throwError(() =>
//               new HttpErrorResponse({
//                 status: 401,
//                 statusText: 'Login Token Expired',
//                 error: { message: 'Your session has expired.' },
//               })
//             );     
//         }
//       }
        
//       );
//     }

//     if (url_token && this.jwtHelper.isTokenExpired(url_token)) {
//       localStorage.removeItem('url_token');
//       //localStorage.removeItem('access_token');
//       return throwError(() => new HttpErrorResponse({
//         status: 401,
//         statusText: 'Token Expired',
//         error: { message: 'Your reset link has expired.' }
//       }));
//     }

 
//     return next.handle(req);
//   }
// }

export class AuthInterceptor implements HttpInterceptor {
  private jwtHelper = new JwtHelperService();
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionTimeoutService,
    private loginservice: LoginService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const refreshTokenUrl = this.loginservice.refreshTokenUrl;
  
    if (req.url.includes(refreshTokenUrl)) {
      return next.handle(req);
    }
  
    if (authToken && !this.jwtHelper.isTokenExpired(authToken)) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
      });
      return next.handle(clonedReq);
    }
  
    if (authToken && refreshToken && !this.sessionService.sessionExpired$.isStopped) {
      if (this.jwtHelper.isTokenExpired(authToken)) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);
  
        const data = {
          Access_Token: authToken,
          Referesh_Token: refreshToken,
        };
  
        return this.loginservice.refreshToken(data).pipe(
          switchMap((response: any) => {
            const newAccessToken = response.str_Message;
            const newRefreshToken = response.referesh_Token;
  
            if (newAccessToken && newRefreshToken) {
              localStorage.setItem('access_token', newAccessToken);
              localStorage.setItem('refresh_token', newRefreshToken);
              this.refreshTokenSubject.next(newAccessToken);
  
              const refreshedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`),
              });
              this.isRefreshing = false;
              return next.handle(refreshedReq);
            } else {
              this.handleSessionExpiration();
              throw new Error('Token refresh failed');
            }
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.handleSessionExpiration();
            return throwError(() =>
              new HttpErrorResponse({
                status: 401,
                statusText: 'Login Token Expired',
                error: { message: 'Your session has expired.' },
              })
            );
          })
        );
      } else {
        return this.refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((newToken) => {
            const clonedReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`),
            });
            return next.handle(clonedReq);
          })
        );
      }
    }
    }else {
      this.handleSessionExpiration();
    }
  
    return next.handle(req);
  }

  private handleSessionExpiration() {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isRefreshing = false; // Reset isRefreshing
    this.refreshTokenSubject.next(null);
  }
}