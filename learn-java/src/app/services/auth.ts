import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'learn_java_admin_logged_in';
  private isLoggedInSignal = signal<boolean>(false);

  constructor() {
    this.isLoggedInSignal.set(localStorage.getItem(this.AUTH_KEY) === 'true');
  }

  isLoggedIn() {
    return this.isLoggedInSignal.asReadonly();
  }

  login(password: string): boolean {
    // Simple mock authentication
    if (password === 'admin123') {
      this.isLoggedInSignal.set(true);
      localStorage.setItem(this.AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedInSignal.set(false);
    localStorage.removeItem(this.AUTH_KEY);
  }
}
