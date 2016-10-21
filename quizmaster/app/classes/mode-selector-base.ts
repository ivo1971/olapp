import {WebsocketMessageService} from './../services/websocket.message.service';

export class ModeSelectorBase {
    public constructor(
        private websocketMessageService: WebsocketMessageService
    ) {
    }

    public init(mode : string) {
        let select = {
            mode: mode
        }
        this.websocketMessageService.sendMsg("mode-select", select);
    }
};