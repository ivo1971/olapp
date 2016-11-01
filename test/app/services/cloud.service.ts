import {BehaviorSubject}           from 'rxjs/BehaviorSubject';
import {Headers}                   from "@angular/http";
import {Http}                      from "@angular/http";
import {Injectable }               from '@angular/core';
import {Observable}                from 'rxjs/Observable';
import {Response}                  from "@angular/http";
import {Subject}                   from 'rxjs/Subject';
import {Subscription}              from 'rxjs/Subscription';
import {TimerObservable}           from "rxjs/Observable/TimerObservable";
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

        this.connectedSubscription = websocketUserService.getObservableConnected().subscribe(
          value => {
              if(value) {
                  logService.log("CloudService got connected");
              } else {
                  logService.log("CloudService got DISconnected");
                  this.getWebsocketAddress();
              }
          });
    }  

    /**********************************************
     * Public methods
     */
    public getObservableConnected() : Observable<boolean> {
        return this.observableConnected;
    }

    /**********************************************
     * Private methods
     */
    private getWebsocketAddressTimed() : void {
        this.logService.log("cloud-service getWebsocketAddressTimed timer start");
        let timer = TimerObservable.create(5000,1000);
        let timerSubscription = timer.subscribe(t => {
            this.logService.log("cloud-service getWebsocketAddressTimed timer expired");
            timerSubscription.unsubscribe();
            this.getWebsocketAddress();
        });
    }

    private getWebsocketAddress() : void {
        this.http.get(this.cloudUrl)
                 .map((res : any) => res.json())
                 .subscribe(
                     res => {
                        this.logService.log("cloud-service getWebsocketAddress response");
                        if(!res.address) {
                            this.logService.error("cloud-service getWebsocketAddress no address");
                            this.logService.error(res);
                            this.getWebsocketAddressTimed();
                        }  else {                    
                            this.logService.log(res);
                            this.subjectConnected.next(true);
                            let websocketAddress = "ws://" + res.address + ":8000/quiz";
                            if(websocketAddress !== this.websocketAddress) {
                                this.websocketAddress = websocketAddress;
                                this.logService.log(this.websocketAddress);                     
                                this.websocketConnect();
                            }
                        }
                     },
                     err => {
                        this.logService.error("cloud-service getWebsocketAddress error response err");
                        this.logService.error(err);
                        this.getWebsocketAddressTimed();
                     }
                 )
    }

    private websocketConnect() : void {
        //connect as soon as all information is available
        this.logService.debug("websocketConnect in");                     
        if((this.userNameValid) && (0 != this.websocketAddress.length)) {
            if(!this.websocketUserServiceConnectCalled) {
                this.logService.debug("websocketConnect connect");                     
                this.websocketUserServiceConnectCalled = true;
                this.websocketUserService.connect(this.websocketAddress);
            } else {
                this.logService.debug("websocketConnect reconfigure");                     
                this.websocketUserService.reconfigureUri(this.websocketAddress);
            }
        }
        this.logService.debug("websocketConnect out");                     
    }

    /**********************************************
     * Private members
     */
    private cloudUrl                          : string                   = "http://chilling-coffin-40047.herokuapp.com/api/address";
    private subjectConnected                  : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private observableConnected               : Observable<boolean>      = this.subjectConnected.asObservable();
    private connectedSubscription             : Subscription             ; 
    private websocketAddress                  : string                   = "";
    private userNameValid                     : boolean                  = false;
    private userSubscription                  : Subscription             ; 
    private websocketUserServiceConnectCalled : boolean                  = false;
}
