import {Component }           from '@angular/core';
import {Observable}           from 'rxjs/Observable';

import {WebsocketUserService } from './../../services/websocket.user.service';

@Component({
  moduleId   : module.id,
  selector   : 'test-app',
  templateUrl: 'echo.component.html'
})
export class EchoComponent { 
    private m_WebsocketDataIn : Observable<any>;
    private m_WebsocketDatas  : any[] = [];
    private m_Type            : string;
    private m_Message         : string;

    public constructor(private m_WebsocketService : WebsocketUserService) {
        //this.m_WebsocketService.connect("ws://echo.websocket.org/");
        //this.m_WebsocketService.connect("ws://192.168.0.69:8000/echo");
        this.m_WebsocketService.connect("ws://192.168.0.69:8000/quiz");

        this.m_WebsocketService.getObservable().subscribe(
            result => {
                this.m_WebsocketDatas.push(result);
            }, 
            error => {
                console.log("Error result");
            }
        );
        this.m_WebsocketDataIn = m_WebsocketService.getObservable();

        var data1 = {
            type: "type",
            message: "message 1"
        };
        var data2 = {
            type: "type",
            message: "message 2"
        };
        var data3 = {
            type: "type",
            message: "message 3"
        };
        this.m_WebsocketService.send(data1);
        this.m_WebsocketService.send(data2);
        this.m_WebsocketService.send(data3);
    }

    public sendMessage() {
        var data = {
            type: this.m_Type,
            message: this.m_Message
        };
        this.m_WebsocketService.send(data);
        this.clearMessage();
    }

    public clearMessage() {
        this.m_Type    = "";
        this.m_Message = "";
    }
}
