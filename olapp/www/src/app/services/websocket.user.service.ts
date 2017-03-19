import {Injectable}              from '@angular/core';
import {Observable}              from 'rxjs/Observable';
import {Subscription}            from 'rxjs/Subscription';

import {ModeService}             from './mode.service';
import {User}                    from './../classes/user.class';
import {UserService}             from './user.service';
import {WebsocketMessageService} from './websocket.message.service';

@Injectable()
export class WebsocketUserService extends WebsocketMessageService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(
        private __modeService : ModeService,
        private userService   : UserService
        ) {
        super(__modeService);

        let user : Observable<User> = this.userService.getObservableUser();
        user.subscribe(
          value => {
              this.user = value;
              this.sendId();
          }
        );

        //register and handle requests to set the team
        this.register("team").subscribe(data => {
            this.userService.setTeam(data.id, data.name);
        });
    }

    /**********************************************
     * Public methods
     */

    /**********************************************
     * Protected methods
     */
    protected onOpen(evt : any) : void {
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
