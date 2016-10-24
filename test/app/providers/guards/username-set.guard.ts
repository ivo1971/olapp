import {CanActivate}           from '@angular/router';
import {CanDeactivate}         from '@angular/router';
import {Injectable}            from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {Router}                from '@angular/router';

import {User}                  from './../../classes/user.class';

import {UserService}           from './../../services/user.service';

@Injectable()
export class UsernameSetGuard implements CanActivate, CanDeactivate {
    private userNameValid      : boolean         = false;

    public constructor(
      private userService      : UserService,
      private router           : Router,
      ) {
        let user : Observable<User> = this.userService.getObservableUser();
        user.subscribe(
          value => {
            this.userNameValid = (0 !== value.name.length);
          }
        );
    }

    public canActivate() {
        if(this.userNameValid) {
          return true;
        }

        //not possible to active
        //--> route to the login page 
        //(to make this possible)
        this.router.navigate(['/login']);
        return false;
    }

    //user by the login page to check that
    //navigating away from it is OK
    //This can happen when the user enters 
    //the login page again via the hamburger
    //menu.
    public canDeactivate() {
        return this.userNameValid;
    }
}
