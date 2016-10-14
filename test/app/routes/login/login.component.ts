import {Component}   from '@angular/core';

import {UserService} from './../../services/user.service';

@Component({
  moduleId   : module.id,
  selector   : 'login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  public constructor(private userService: UserService) { 
    this.userName = userService.getUser().name;
  }

  public setName() {
    this.userService.setName(this.userName);
  }

  private userName : string;
}