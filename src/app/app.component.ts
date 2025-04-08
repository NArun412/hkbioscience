import { Component, OnDestroy,AfterViewInit, OnInit,ViewChild,ElementRef,TemplateRef, HostListener } from '@angular/core';
import { NavigationEnd, Router,ActivatedRoute } from '@angular/router';
import { SharedService } from '../../src/app/services/shared.service';
import { ModalService } from '../../src/app/common/modal.service';
import {ChatBotPopupComponent} from '../app/common/modal/chat-bot-popup/chat-bot-popup.component';
import {ModalSpinnerComponent} from '../app/modal-spinner/modal-spinner.component';
import { filter, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as bootstrap from 'bootstrap';
import { SessionTimeoutService } from '../../src/app/services/session-timeout.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { LoginService } from './services/login.service';
declare const clarity: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit , OnInit,OnDestroy {
  private jwtHelper = new JwtHelperService();
  navbar=false;
  title = 'HKBioScience';
  public login: boolean = false;
  CurrentYear: number = new Date().getFullYear();
  isUserLoggedIn: boolean = false;
  Username: string | null = localStorage.getItem('Username');
  Sessiontime: string | null = localStorage.getItem('SessionTime');
//Username = localStorage.getItem('Username');
  private hasSessionExpired = false;
  private visibilityChangeListener!: () => void;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;
  @ViewChild(ChatBotPopupComponent) modalComponent!: ChatBotPopupComponent;
  @ViewChild(ModalSpinnerComponent) spinnerComponent!: ModalSpinnerComponent;
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  resetInactivityTimer() {
    if(this.Sessiontime != null){
      this.sessionTimeoutService.resetInactivityTimer(Number(this.Sessiontime) * 60 * 1000);
    }
  }

  
  ngAfterViewInit() {
    this.modalService.registerModal(this.modalComponent);
    this.sharedService.registerModal(this.spinnerComponent);
  }
  openChatbot() {
    this.modalService.openModal();
    if (this.modalComponent) {
      this.modalComponent.reloadComponent();
    }
  }

  // Function to collapse the navbar after a menu item is clicked
  closeNavbar() {

    const navbar = this.navbarCollapse.nativeElement;
    if (navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  constructor(private router: Router,private sharedService: SharedService,private activatedRoute:ActivatedRoute, 
    private modalService :ModalService,private sessionTimeoutService: SessionTimeoutService, private loginservice: LoginService ) {
     // Subscribe to router events
    
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // Scroll to top on route change
        window.scrollTo(0, 0);

        // Check if it's a login/reset password route
        if (event.url === '/Login' || event.url.includes('/ResetPassword')) {
          this.login = true;
        } else {
          this.login = false;
        }
      }
    });
  }

  openSpinnerModal() {
    this.sharedService.openModal();
  }

  closeSpinnerModal() {
    this.sharedService.closeModal();
  }  
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Update the Username from localStorage after navigation
        this.Username = localStorage.getItem('Username');
        this.Sessiontime = localStorage.getItem('SessionTime');
      }
    });

    // Handle visibility change for refreshing tokens
    this.visibilityChangeListener = () => {
      if (document.visibilityState === 'visible') {
        this.checkAndRefreshToken();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityChangeListener);

    // Start inactivity timer
    if(this.Sessiontime != null){
      this.sessionTimeoutService.startInactivityTimer(Number(this.Sessiontime) * 60 * 1000);
    }
    // Subscribe to session expiration events
    this.sessionTimeoutService.sessionExpired$.subscribe(() => {
      this.handleSessionExpiration();
    });

    // Set token expiry timer based on token expiration
    const authToken = localStorage.getItem('access_token');
    if (authToken) {
      const expiryDuration = this.jwtHelper.getTokenExpirationDate(authToken)!.getTime() - Date.now();
      this.sessionTimeoutService.setTokenExpiryTimeout(expiryDuration);
    }
    this.checkTokenOnAppLoad();
  }
  checkTokenOnAppLoad() {
    const token = localStorage.getItem('access_token');
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      localStorage.setItem('isUserLoggedIn', 'false');
      //this.router.navigate(['/Login']);
    }
  }


  checkAndRefreshToken() {
    const authToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (authToken && this.jwtHelper.isTokenExpired(authToken)) {
      if (refreshToken) {
        // Attempt silent refresh if token expired
        const data = {
          Access_Token: authToken,
          Referesh_Token: refreshToken,
        };
        this.loginservice.refreshToken(data).subscribe({
          next: (response: any) => {
            const newAccessToken = response.str_Message;
            const newRefreshToken = response.referesh_Token;

            if (newAccessToken && newRefreshToken) {
              localStorage.setItem('access_token', newAccessToken);
              localStorage.setItem('refresh_token', newRefreshToken);
            } else {
              this.handleSessionExpiration();
            }
          },
          error: () => {
            this.handleSessionExpiration();
          },
        });
      } else {
        this.handleSessionExpiration();
      }
    }
  }

  handleSessionExpiration() {
    this.hasSessionExpired = true;
    Swal.fire({
      title: 'Session Expired',
      text: 'Your session has expired. Please log in again to continue.',
      icon: 'warning',
      confirmButtonText: 'OK',
    }).then(() => {
      this.Sessiontime = null ;
      localStorage.removeItem('SessionTime');
      this.router.navigate(['/Login']);
    });
  }
  

  checkLoginStatus() {
    this.isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
  }

  // Logout the user
  logout_user() {
    localStorage.setItem('isUserLoggedIn', 'false');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('Username');
    this.Username = null;
    this.Sessiontime = null ;
    this.isUserLoggedIn = false;
    this.sessionTimeoutService.clearInactivityTimer();
    this.sessionTimeoutService.clearTokenExpiryTimeout();
    this.router.navigate(['/Login']);
  }

  ngDoCheck(): void {
    // This will check the login status whenever there's a change detection cycle
    this.checkLoginStatus();
  }

  routerchange() {
    const routerUrl = this.router.url;
    let pageName ='';
    const currentRoute = this.getChildRoute(this.activatedRoute);
    pageName = currentRoute.snapshot.data['pageName'] || '';

    this.sharedService.setRouter(routerUrl,pageName);
    this.closeNavbar();
  }

  private getChildRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
  ngOnDestroy(): void {
      // Remove the visibility change listener if it was set
    document.removeEventListener('visibilitychange', this.visibilityChangeListener);
    this.sessionTimeoutService.clearInactivityTimer();
    this.sessionTimeoutService.clearTokenExpiryTimeout();
  }
}