import {Injectable}       from '@angular/core';

import {User}             from './../classes/user.class';
import {UserService}      from './user.service';
import {WebsocketService} from './websocket.service';

@Injectable()
export class WebsocketUserService extends WebsocketService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(private userService : UserService) {
        super();
    }    

    /**********************************************
     * Public methods
     */

    /**********************************************
     * Private methods
     */
    protected onOpen(evt) : void {
        console.log("WebsocketUserService CONNECTED");
        let user : User = this.userService.getUser();
        let data = {
            mi: "id",
            data: {
                id: user.id,
                name: user.name
            }
        };
        this.prepareFront(data);
        super.onOpen(evt);
    }

    /**********************************************
     * Private members
     */
}
