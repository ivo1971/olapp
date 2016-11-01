import {Injectable}       from '@angular/core';

import {WebsocketUserService}  from './websocket.user.service';

@Injectable()
export class LogService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(
        private websocketUserService : WebsocketUserService
    ) {
        this.websocketUserService.register("log-level").subscribe( data => {
            this.remoteLogLevel = data.logLevel;
        });
    } 

    /**********************************************
     * Public construction/destruction
     */
    public debug(text : string) : void {
        //console.debug(text);
        this.send("debug", text);
    }

    public log(text : string) : void {
        console.log(text);
        this.send("log", text);
    }

    public info(text : string) : void {
        console.info(text);
        this.send("info", text);
    }

    public warn(text : string) : void {
        console.warn(text);
        this.send("warn", text);
    }

    public error(text : string) : void {
        console.error(text);
        this.send("error", text);
    }

    /**********************************************
     * Private functions
     */
    private send(level : string, text : string) {
        //check if remote logging is enabled
        if(0 == this.remoteLogLevel.length) {
            return;
        }

        //send log to the websocket
        this.websocketUserService.send({
            mi: "log",
            data: {
                level: level,
                text:  text
            }
        })
    }

    /**********************************************
     * Private functions
     */
    private remoteLogLevel : string = "";
}
