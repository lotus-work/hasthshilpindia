import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const admin_token = localStorage.getItem('admin_token');

    if (admin_token) {
      console.log("from auth guard");
      if (isTokenExpired(admin_token)) {
        console.log("from auth guard clearing...");
        localStorage.clear();
        this.router.navigate(['/admin/login']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch (error) {
    console.error('Token parsing failed', error);
    return true;
  }
}