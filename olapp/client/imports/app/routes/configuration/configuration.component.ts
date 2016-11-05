import {Component}             from '@angular/core';
import {Location}              from '@angular/common';
import {OnInit}                from '@angular/core';
import {Router}                from '@angular/router';

import {ComponentBase}         from './../../classes/component-base.class';

import {CloudService}          from './../../services/cloud.service';
import {WebsocketUserService}  from './../../services/websocket.user.service';

import template                from "./configuration.component.html";
import style                   from "./configuration.component.scss";

@Component({
  selector: "configuration",
  template,
  styles: [ style ]
})
export class ConfigurationComponent extends ComponentBase implements OnInit { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    private wsServer      : string  = "";
    private wsServerValid : boolean = false;

    /* Construction
     */
    public constructor(
        private router                : Router,
        private _websocketUserService : WebsocketUserService,
        private cloudServerice        : CloudService,
        private location              : Location
        ) { 
        super(_websocketUserService);
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        this.wsServer = this.cloudServerice.getWsAddress();
        this.onWsServerChanged(this.wsServer);
    }

    /* Template event handlers
     */
    //validate the value of wsServer and set wsServerValid accordingly
    public onWsServerChanged(newValue : string) {
        //regex source: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
        this.wsServerValid = new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$').test(newValue);
    }

    public onConfigure() {
        console.log("onConfigure [" + this.wsServer + "]");
        this.cloudServerice.setWsAddress(this.wsServer);
        this.router.navigate(['/quiz/welcome']);
    }

    public onCancel() {
        console.log("onCancel");
        this.location.back();
    }

    public onDefault() {
        console.log("11111111");
        console.log("onDefault");
        this.cloudServerice.setWsDefault();
        this.router.navigate(['/quiz/welcome']);
    }
}

