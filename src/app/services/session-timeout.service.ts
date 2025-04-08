import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  private inactivityTimeout: any;
  private tokenExpiryTimeout: any;
  public sessionExpired$ = new Subject<void>();

  startInactivityTimer(duration: number) {
    this.clearInactivityTimer();
    this.inactivityTimeout = setTimeout(() => {
      if (localStorage.getItem('isUserLoggedIn') === 'true') {
        this.sessionExpired$.next();
      }
    }, duration);
  }

  resetInactivityTimer(duration: number) {
    this.startInactivityTimer(duration);
  }

  clearInactivityTimer() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
  }

  setTokenExpiryTimeout(expiryDuration: number) {
  this.clearTokenExpiryTimeout();
  this.tokenExpiryTimeout = setTimeout(() => {
    if (localStorage.getItem('isUserLoggedIn') === 'true') {
      this.sessionExpired$.next();
    }
  }, expiryDuration);
}

  clearTokenExpiryTimeout() {
    if (this.tokenExpiryTimeout) {
      clearTimeout(this.tokenExpiryTimeout);
    }
  }
}
