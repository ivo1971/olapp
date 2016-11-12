import {Injectable}              from '@angular/core';
import {Observable}              from 'rxjs/Observable';
import {Subscription}            from 'rxjs/Subscription';

import {User}                    from './../classes/user.class';
import {UserService}             from './user.service';
import {WebsocketMessageService} from './websocket.message.service';

@Injectable()
export class WebsocketUserService extends WebsocketMessageService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(private userService : UserService) {
        super();

        let user : Observable<User> = this.userService.getObservableUser();
        user.subscribe(
          value => {
              this.user = value;
              this.sendId();
          }
        );

        //register and handle requests to set the team
        this.register("team").subscribe(data => {
            this.userService.setTeam(data.name);
        });
    }

    /**********************************************
     * Public methods
     */

    /**********************************************
     * Protected methods
     */
    protected onOpen(evt) : void {
        //console.log("WebsocketUserService CONNECTED");
        this.sendId();
        super.onOpen(evt);
    }

    /**********************************************
     * Private methods
     */
    private sendId() : void {
        if(0 == this.user.name.length) {
            //no valid user
            //do not sent id
            return;
        }

        let data = {
            mi: "id",
            data: {
                id: this.user.id,
                name: this.user.name
            }
        };
        this.prepareFront(data);
    }

    /**********************************************
     * Private members
     */
    private user             : User = new User();
}
