import {Injectable }     from '@angular/core';
import {Observable}      from 'rxjs/Observable';
import {Subject}         from 'rxjs/Subject';
import {TimerObservable} from "rxjs/Observable/TimerObservable";

@Injectable()
export class WebsocketService {
    /**********************************************
     * Public construction/destruction
     */
    constructor() {
    }    

    /**********************************************
     * Public methods
     */
    public connect(wsUri : string) : void {
        if(this.m_Websocket) {
            throw new Error("WebsocketService already connected");
        }
        let match = new RegExp('wss?:\/\/').test(wsUri);
        if (!match) {
            throw new Error("WebsocketService invalid url [" + wsUri + "provided");
        }
        this.m_WsUri = wsUri;
        this.connectAttempt();
    }

    public send(data) : void {
        console.log("WebsocketService send: " + JSON.stringify(data));
        this.m_SendQueue.push(data);
        this.fireQueue();
    };

    public getObservable() : Observable<any[]> {
        return this.m_DataIn.asObservable();
    }

    /**********************************************
     * Protected methods
     */
    protected prepareFront(data) : void {
        console.log("WebsocketService prepareFront: " + JSON.stringify(data));
        this.m_SendQueue.unshift(data);
    }
    
    /**********************************************
     * Private methods
     */
    private connectAttempt() : void {
        console.log("WebsocketService connect to [" + this.m_WsUri + "]");
        this.m_Websocket = new WebSocket(this.m_WsUri);
        this.m_Websocket.onopen = (evt : Event) => { 
            this.onOpen(evt); 
        };
        this.m_Websocket.onclose = (evt : Event) => { 
            this.onClose(evt); 
        };
        this.m_Websocket.onmessage = (evt : Event) => { 
            this.onMessage(evt); 
        };
        this.m_Websocket.onerror = (evt : Event) => { 
            this.onError(evt);
        };
    }

    protected onOpen(evt) : void {
        console.log("WebsocketService CONNECTED to [" + this.m_WsUri + "]");
        this.m_WebsocketOpen = true;
        this.fireQueue();
    }

    private onClose(evt) : void {
        console.log("WebsocketService DISCONNECTED from [" + this.m_WsUri + "]");
        this.m_WebsocketOpen = false;
        let timer = TimerObservable.create(2000,1000);
        let timerSubscription = timer.subscribe(t => {
            timerSubscription.unsubscribe();
            this.connectAttempt();
        });
    }

    private onMessage(evt) : void {
        console.log("WebsocketService MESSAGE: " + evt.data);
        console.log(evt);
        this.m_DataIn.next(JSON.parse(evt.data));
    }

    private onError(evt) : void {
        console.log("WebsocketService ERROR: " + evt.data);
        console.log(evt);
        this.m_WebsocketOpen = false;
        //TODO: reconnect?
    }

    private fireQueue() : void {        
        if(!this.m_Websocket) {
            console.log("WebsocketService fire: not connected");
        }

        while (this.m_WebsocketOpen && this.m_SendQueue.length) {
            let data = this.m_SendQueue.shift();
            console.log("WebsocketService fire: sending " + JSON.stringify(data));
            this.m_Websocket.send(JSON.stringify(data));
        }
    }

    /**********************************************
     * Private members
     */
    private m_WsUri         : string         ;
    private m_Websocket     : any            ;
    private m_WebsocketOpen : boolean        = false;
    private m_SendQueue     : any[]          = [];
    private m_DataIn        : Subject<any>   = new Subject<any>();
}
