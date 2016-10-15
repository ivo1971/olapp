import {Injectable}       from '@angular/core';

import {WebsocketService} from './websocket.service';

@Injectable()
export class WebsocketMessageService extends WebsocketService {
    /**********************************************
     * Public construction/destruction
     */
    constructor() {
        super();
    }    

    /**********************************************
     * Public methods
     */
    public sendMsg(mi: string, data: any) : void {
        console.log("WebsocketMessageService send [" + mi + "]: " + JSON.stringify(data));
        let msg = {
            mi: mi,
            data: data
        };
        this.send(msg);
    };

    /**********************************************
     * Private methods
     */

    /**********************************************
     * Private members
     */
}
