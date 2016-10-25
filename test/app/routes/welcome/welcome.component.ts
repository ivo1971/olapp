import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {UserService}          from './../../services/user.service';
import {User}                 from './../../classes/user.class';

@Component({
    moduleId   : module.id,
    selector   : 'welcome',
    templateUrl: 'welcome.component.html'
})
export class WelcomeComponent implements OnDestroy { 
    private userName         : string = "";
    private userObservable   : Observable<User>;
    private userSubscription : Subscription;
    public constructor(
        private userService : UserService
        ) { 
        this.userObservable   = userService.getObservableUser();
        this.userSubscription = this.userObservable.subscribe(
          value => {
            this.userName = value.name;
          });
    }

    public ngOnDestroy() : void {
        this.userSubscription.unsubscribe();
    }
}
