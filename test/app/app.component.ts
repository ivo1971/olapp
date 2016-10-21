import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';

import {User}                  from './classes/user.class';
import {UserService }          from './services/user.service';

@Component({
    moduleId   : module.id,
    selector   : 'test-app',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    private userNameValid : boolean  = false;

    public constructor(
      private userService : UserService
      ) {
        let user : Observable<User> = userService.getObservableUser();
        user.subscribe(
          value => {
            this.userNameValid = (0 !== value.name.length);
            console.log(value.name + " ==> [" + this.userNameValid + "]");
          });
    }
}
