import {Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject}     from 'rxjs/Subject';

import { WebsocketService } from '../../services/websocket/websocket.service';

@Component({
    templateUrl: 'hello-ionic.html',
    providers: [WebsocketService]
})
export class HelloIonicPage {
    private m_WebsocketDataIn : Observable<any>;
    private m_WebsocketDatas  : any[] = [];
    public constructor(private m_WebsocketService : WebsocketService) {
        m_WebsocketService.connect("ws://echo.websocket.org/");

        m_WebsocketService.getObservable().subscribe(
            result => {
                console.log("Got result: " + result);
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
        m_WebsocketService.send(data1);
        m_WebsocketService.send(data2);
        m_WebsocketService.send(data3);
    }
}
