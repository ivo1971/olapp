import {Injectable }     from '@angular/core';

import {User }           from '../classes/user.class';

@Injectable()
export class UserService {
    /**********************************************
     * Public construction/destruction
     */
    constructor() {
        console.log("UserService: constructed with name [" + this.user.name + "]");
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
        console.log("UserService: set name to [" + this.user.name + "]");
    };

    /**********************************************
     * Private methods
     */

    /**********************************************
     * Private members
     */
    private user          : User         = new User();
}
