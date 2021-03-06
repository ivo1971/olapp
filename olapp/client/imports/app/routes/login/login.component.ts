import {Component}             from '@angular/core';
import {Location}              from '@angular/common';
import {Router}                from '@angular/router';

import {UserService}           from './../../services/user.service';

import template                from "./login.component.html";
import style                   from "./login.component.scss";

@Component({
  selector: "login",
  template,
  styles: [ style ]
})
export class LoginComponent {
  public constructor(
    private router      : Router,
    private location    : Location,
    private userService : UserService
    ) { 
      this.userName   = userService.getUser().name;
      this.showCancel = (0 != this.userName.length) && (this.router.navigated); 
  }

  public setName() {
      this.userService.setName(this.userName);
      this.router.navigate(['/quiz/welcome']);
  }

  public cancel() {
      this.location.back();
  }

  private userName   : string;
  private showCancel : boolean = false;
}
