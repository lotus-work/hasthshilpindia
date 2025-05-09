import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isTokenExpired } from '../../jwt-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      console.log("from auth guard");
      if (isTokenExpired(token)) {
        console.log("from auth guard clearing...");
        localStorage.clear();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}