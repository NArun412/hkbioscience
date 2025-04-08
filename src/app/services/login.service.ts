import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpService} from '../services/http-service'   
import { Login, ResetLink } from 'src/Model/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(@Inject(HttpService) private httpservice: HttpService) { }
  LoginValidateAPI= 'Login/ValidateLogin';
  ValidateLogin(data: any): Observable<Login[]> {
    return this.httpservice.post<Login[]>(this.LoginValidateAPI,data);
  }
  SentResetAPI = 'Login/ForgotPasswordEmail';
  SentResetLink(data: any): Observable<ResetLink[]> {
    return this.httpservice.post<ResetLink[]>(this.SentResetAPI,data);
  }

  ResetPasswordAPI = 'Login/ResetPassword';
  Save_Password(data: any): Observable<any[]> {
    return this.httpservice.post<any[]>(this.ResetPasswordAPI,data);
  }
 refreshTokenUrl = 'Login/RefreshToken';
  refreshToken(data: any): Observable<any[]> {
    return this.httpservice.post<any[]>(this.refreshTokenUrl,data);
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }
}
