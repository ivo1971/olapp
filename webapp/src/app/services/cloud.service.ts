import {BehaviorSubject}           from 'rxjs/BehaviorSubject';
import {Headers}                   from "@angular/http";
import {Http}                      from "@angular/http";
import {Injectable }               from '@angular/core';
import {IntervalObservable}        from 'rxjs/observable/IntervalObservable';
import {Observable}                from 'rxjs/Observable';
import {Response}                  from "@angular/http";
import {Subject}                   from 'rxjs/Subject';
import {Subscription}              from 'rxjs/Subscription';
import {RequestOptions}            from "@angular/http";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {LogService}                from './log.service';
import {UserService}               from './user.service';
import {WebsocketUserService}      from './websocket.user.service';

@Injectable()
export class CloudService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(
        private http                 : Http,
        private logService           : LogService,
        private userService          : UserService,
        private websocketUserService : WebsocketUserService
    ) {
        this.userSubscription = this.userService.getObservableUser().subscribe(
          value => {
            this.userNameValid = (0 !== value.name.length);
            this.websocketConnect();
          }
        );

        //kick getting the cloud address
        this.getWebsocketAddress();
    }  

    /**********************************************
     * Public methods
     */
    public getObservableConnected() : Observable<number> {
        return this.observableConnected;
    }

    public getWsAddress() : string {
        return this.websocketAddress;
    }

    public setWsAddress(wsAddress : string) : void {
        this.websocketAddress       = wsAddress;
        this.websocketAddressManual = true;
        this.websocketConnect();
    }

    public setWsDefault() : void {
        this.websocketAddressManual = false;
        this.getWebsocketAddress();
    }

    /**********************************************
     * Private methods
     */
    private getWebsocketAddressTimed(timeSec : number = 5) : void {
        this.logService.log("cloud-service getWebsocketAddressTimed timer start");
        let timer = IntervalObservable.create(timeSec * 1000);
        let timerSubscription = timer.subscribe(t => {
            this.logService.log("cloud-service getWebsocketAddressTimed timer expired");
            timerSubscription.unsubscribe();
            this.getWebsocketAddress();
        })
    }

    private getWebsocketAddress() : void {
        if(this.websocketAddressManual) {
            //address has been overridden manually
            //ignore request result
            //(untill the app restarts)
            return;
        }
        this.http.get(this.cloudUrl)
                 .map((res : any) => res.json())
                 .subscribe(
                     res => {
                        if(this.websocketAddressManual) {
                            //address has been overridden manually
                            //ignore request result
                            //(do not start the timer)
                            return;
                        }
                        this.logService.log("cloud-service getWebsocketAddress response");
                        if(!res.address) {
                            this.logService.error("cloud-service getWebsocketAddress no address");
                            this.logService.error(res);
                            this.subjectConnected.next(-1);                            
                            this.getWebsocketAddressTimed();
                        }  else {                    
                            this.logService.log(res);
                            if(0 == res.address) {
                                console.warn("cloud-service getWebsocketAddress got 0 address");
                                this.subjectConnected.next(0);
                                this.getWebsocketAddressTimed(20);
                            } else if(res.address !== this.websocketAddress) {
                                this.websocketAddress = res.address;
                                this.subjectConnected.next(1);
                                this.logService.log(this.websocketAddress);                     
                                this.websocketConnect();
                            }
                        }
                     },
                     err => {
                        this.logService.error("cloud-service getWebsocketAddress error response err");
                        this.logService.error(err);
                        this.subjectConnected.next(-1);                            
                        this.getWebsocketAddressTimed();
                     }
                 )
    }

    private websocketConnect() : void {
        //connect as soon as all information is available
        this.logService.debug("websocketConnect in");                     
        if((this.userNameValid) && (0 != this.websocketAddress.length)) {
            let websocketUri = "ws://" + this.websocketAddress;
            if(!this.websocketUserServiceConnectCalled) {
                this.logService.debug("websocketConnect connect");                     
                this.websocketUserServiceConnectCalled = true;
                this.websocketUserService.connect(websocketUri);
            } else {
                this.logService.debug("websocketConnect reconfigure");                     
                this.websocketUserService.reconfigureUri(websocketUri);
            }
        }
        this.logService.debug("websocketConnect out");                     
    }

    /**********************************************
     * Private members
     */
    private cloudUrl                          : string                   = "http://chilling-coffin-40047.herokuapp.com/api/address";
    private subjectConnected                  : BehaviorSubject<number>  = new BehaviorSubject<number>(-1);
    private observableConnected               : Observable<number>       = this.subjectConnected.asObservable();
    private connectedSubscription             : Subscription             ; 
    private websocketAddress                  : string                   = "";
    private websocketAddressManual            : boolean                  = false;
    private userNameValid                     : boolean                  = false;
    private userSubscription                  : Subscription             ; 
    private websocketUserServiceConnectCalled : boolean                  = false;
}
