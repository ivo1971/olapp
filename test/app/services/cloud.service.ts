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

import {UserService}               from './user.service';
import {WebsocketUserService}      from './websocket.user.service';

@Injectable()
export class CloudService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(
        private http                 : Http,
        private userService          : UserService,
        private websocketUserService : WebsocketUserService
    ) {
        this.userSubscription = this.userService.getObservableUser().subscribe(
          value => {
            this.userNameValid = (0 !== value.name.length);
            if(!this.websocketUserServiceConnectCalled) {
                this.websocketConnect();
            }
          }
        );

        this.connectedSubscription = websocketUserService.getObservableConnected().subscribe(
          value => {
              if(value) {
                  console.log("CloudService got connected");
              } else {
                  console.log("CloudService got DISconnected");
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
    private getWebsocketAddress() : void {
        this.http.get(this.cloudUrl)
                 .map((res : any) => res.json())
                 .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
                 .subscribe(res => {
                    console.log("cloud-service getWebsocketAddress response");
                    console.log(res);                     
                    this.subjectConnected.next(true);
                    let websocketAddress = "ws://" + res.address + ":8000/quiz";
                    if(websocketAddress !== this.websocketAddress) {
                        this.websocketAddress = websocketAddress;
                        console.log(this.websocketAddress);                     
                        this.websocketConnect();
                    }
                 })
    }

    private websocketConnect() : void {
        //connect as soon as all information is available
        console.log("websocketConnect in");                     
        if((this.userNameValid) && (0 != this.websocketAddress.length)) {
            console.log("websocketConnect connect");                     
            this.websocketUserServiceConnectCalled = true;
            this.websocketUserService.connect(this.websocketAddress);
        }
        console.log("websocketConnect out");                     
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
