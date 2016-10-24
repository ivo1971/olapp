import {Component}             from '@angular/core';
import {Router}                from '@angular/router';

import {UserService}           from './../../services/user.service';

@Component({
  moduleId   : module.id,
  selector   : 'login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  public constructor(
    private userService : UserService,
    private router      : Router
    ) { 
    this.userName = userService.getUser().name;
  }

  public setName() {
    this.userService.setName(this.userName);
    this.router.navigate(['/quiz/welcome']);
  }

  private userName : string;
}
