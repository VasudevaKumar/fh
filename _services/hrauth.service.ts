import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class HrauthService implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router)
  {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
      if(localStorage.getItem('currentUser') != null)
      {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let role_id = currentUser[0].role_id;
        if(role_id==3)
        {
          return true;
        }
        else{
          window.location.href = 'http://facehiring.com';
        }
    }
    else{
      
      // return this.router.parseUrl("/");
      window.location.href = 'http://facehiring.com';
    }

  }
}