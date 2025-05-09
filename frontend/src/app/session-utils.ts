import { Router } from '@angular/router';
import { isTokenExpired } from './jwt-utils';

export function handleSessionExpiration(token: string, router: Router): void {
  if (token && isTokenExpired(token)) {
    alert('Session expired. Please log in again.');
    localStorage.clear();
    router.navigate(['/login']);
  }
}