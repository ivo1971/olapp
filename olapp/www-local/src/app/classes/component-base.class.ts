import {WebsocketUserService}  from './../services/websocket.user.service';

export class ComponentBase {
    public constructor(
        private websocketUserService : WebsocketUserService
        ) {
    }

    protected sendLocation(mode : string) {
        this.websocketUserService.sendMsg("mode", {
            mode: mode
        });
    }
}