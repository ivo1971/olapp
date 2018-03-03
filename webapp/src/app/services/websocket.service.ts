import {Injectable        } from '@angular/core';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Observable        } from 'rxjs/Observable';
import {BehaviorSubject   } from 'rxjs/BehaviorSubject';
import {Subject           } from 'rxjs/Subject';

import {ModeService, EMode} from './mode.service';

@Injectable()
export class WebsocketService {
    /**********************************************
     * Private members
     */
    private m_WsUriBase:            string                   ;
    private m_WsUri:                string                   ;
    private m_Websocket:            any                      ;
    private m_WebsocketOpen:        Boolean                  = false;
    private m_SendQueue:            any[]                    = [];
    private m_DataIn:               Subject<any>             = new Subject<any>();
    private m_SubjectConnected:     BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private m_ObservableConnected:  Observable<boolean>      = this.m_SubjectConnected.asObservable();

    /**********************************************
     * Public construction/destruction
     */
    constructor(
        private modeService: ModeService
    ) {
    }

    /**********************************************
     * Public methods
     */
    public connect(wsUri : string): void {
        if(this.m_Websocket) {
            throw new Error('WebsocketService already connected');
        }
        this.setUri(wsUri);
        this.connectAttempt();
    }

    public reconfigureUri(wsUri: string): void {
        // check if there is a URI change
        if(!this.setUri(wsUri)) {
            // no change
            return;
        }

        // check for an open connection
        if(!this.m_WebsocketOpen) {
            // no socket open,
            // reconnect is imminent
            return;
        }

        // check for a valud socket
        if(!this.m_Websocket) {
            // this should not happen
            return;
        }

        // socket open
        // force reconnect
        this.m_Websocket.close();
    }

    public send(data: any): void {
        // console.log("WebsocketService send: " + JSON.stringify(data));
        this.m_SendQueue.push(data);
        this.fireQueue();
    };

    public getObservable(): Observable<any[]> {
        return this.m_DataIn.asObservable();
    }

    public getObservableConnected() : Observable<boolean> {
        return this.m_ObservableConnected;
    }

    /**********************************************
     * Protected methods
     */
    protected prepareFront(data: any): void {
        // console.log("WebsocketService prepareFront: " + JSON.stringify(data));
        this.m_SendQueue.unshift(data);
    }

    /**********************************************
     * Private methods
     */
    private setUri(wsUri: string): Boolean {
        // only change when there is a change
        if(wsUri === this.m_WsUriBase) {
            // no change
            return false;
        }

        // validate
        const match = new RegExp('wss?:\/\/').test(wsUri);
        if (!match) {
            throw new Error('WebsocketService invalid url [' + wsUri + 'provided');
        }

        // change
        this.m_WsUriBase = wsUri;
        let mode = '';
        switch(this.modeService.GetMode()) {
            case EMode.Beamer:
                mode = 'beamer';
                break;
            case EMode.Master:
                mode = 'master';
                break;
            case EMode.Quiz:
                mode = 'quiz';
                break;
            default:
                console.log('Unhandled mode [' + this.modeService.GetMode() + '] --> using default');
                mode = 'quiz';
                break;
        }
        this.m_WsUri = wsUri + ':8000/' + mode;
        console.log('connect [' + this.m_WsUri + ']');
        return true;
    }

    private connectAttempt(): void {
        // console.log("WebsocketService connect to [" + this.m_WsUri + "]");
        delete(this.m_Websocket);
        this.m_Websocket = new WebSocket(this.m_WsUri);
        this.m_Websocket.onopen = (evt: Event) => {
            this.onOpen(evt);
        };
        this.m_Websocket.onclose = (evt: Event) => {
            this.onClose(evt);
        };
        this.m_Websocket.onmessage = (evt: Event) => {
            this.onMessage(evt);
        };
        this.m_Websocket.onerror = (evt: Event) => { 
            this.onError(evt);
        };
    }

    protected onOpen(evt: any): void {
        // console.log("WebsocketService CONNECTED to [" + this.m_WsUri + "]");
        this.m_WebsocketOpen = true;
        this.m_SubjectConnected.next(true);
        this.fireQueue();
    }

    private onClose(evt: any): void {
        // console.log("WebsocketService DISCONNECTED from [" + this.m_WsUri + "]");
        this.m_WebsocketOpen = false;
        this.m_SubjectConnected.next(false);
        const timer = IntervalObservable.create(2000);
        const timerSubscription = timer.subscribe(t => {
            timerSubscription.unsubscribe();
            this.connectAttempt();
        });
    }

    private onMessage(evt: any): void {
        // console.log('WebsocketService MESSAGE: ' + evt.data);
        // console.log(evt);
        this.m_DataIn.next(JSON.parse(evt.data));
    }

    private onError(evt: any): void {
        // console.log("WebsocketService ERROR: " + evt.data);
        console.log(evt);
        this.m_WebsocketOpen = false;
        // TODO: reconnect?
    }

    private fireQueue(): void {
        if (!this.m_Websocket) {
            // console.log("WebsocketService fire: not connected");
        }

        while (this.m_WebsocketOpen && this.m_SendQueue.length) {
            const data = this.m_SendQueue.shift();
            // console.log("WebsocketService fire: sending " + JSON.stringify(data));
            this.m_Websocket.send(JSON.stringify(data));
        }
    }
}
