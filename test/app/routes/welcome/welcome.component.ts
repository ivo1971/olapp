import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';

import {UserService}          from './../../services/user.service';
import {User}                 from './../../classes/user.class';

@Component({
    moduleId   : module.id,
    selector   : 'welcome',
    templateUrl: 'welcome.component.html'
})
export class WelcomeComponent { 
    private userName : string = "";

    public constructor(
        private userService : UserService
        ) { 
        let user : Observable<User> = userService.getObservableUser();
        user.subscribe(
          value => {
            this.userName = value.name;
          });
    }
}
