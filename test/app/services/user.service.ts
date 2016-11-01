import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';
import {BehaviorSubject}  from 'rxjs/BehaviorSubject';

import {User}             from '../classes/user.class';

@Injectable()
export class UserService {
    /**********************************************
     * Public construction/destruction
     */
    constructor() {
    }    

    /**********************************************
     * Public methods
     */
    public getUser() : User {
        return this.user;
    };

    public setName(name : string) : void {
        this.user.name = name;
        this.user.store();
        this.subjectUser.next(this.user);
    };

    public setTeam(team: string) : void {
        this.user.team = team;
        this.subjectUser.next(this.user);
    };

    public getObservableUser() : Observable<User> {
        return this.observableUser;
    }

    /**********************************************
     * Private methods
     */

    /**********************************************
     * Private members
     */
    private user           : User                  = new User();
    private subjectUser    : BehaviorSubject<User> = new BehaviorSubject<User>(this.user);
    private observableUser : Observable<User>      = this.subjectUser.asObservable();
}
