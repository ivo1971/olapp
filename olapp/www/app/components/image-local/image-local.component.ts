import {Component}             from '@angular/core';
import {EventEmitter}          from '@angular/core';
import {Input}                 from '@angular/core';
import {OnInit}                from '@angular/core';
import {Output}                from '@angular/core';
import {Subscription}          from 'rxjs/Subscription';

import {CloudService}          from './../../services/cloud.service';

@Component({
  moduleId   : module.id,
  selector   : 'image-local',
  styleUrls  : [
      'image-local.component.css',
  ],
  templateUrl: 'image-local.component.html'
})
export class ImageLocalComponent implements OnInit { 
    @Input()  set source(source: string) {
        this.sourceUrl = source;
        this.calcFull();
    };
    @Input()  height     : string = "-1";
    @Input()  width      : string = "-1";
    @Input()  class      : string = "none";
    @Output() clickImage : EventEmitter<string> = new EventEmitter<string>();
    public    fullSrc    : string = "";

    public constructor(
        private cloudService        : CloudService
        ) {
        }

    public ngOnInit() : void {
        if(("-1" == this.height) && ("-1" == this.width)) {
            this.height = "100";
            this.width  = "100";
        } else if("-1" == this.height) {
            this.height = this.width;
        } else if("-1" == this.width) {
            this.width  = this.height;
        }
        this.cloudConnectedSubscription = this.cloudService.getObservableConnected().subscribe(
          value => {
              if(0 < value) {
                this.wsAddress = this.cloudService.getWsAddress();
                this.calcFull();
              } 
          }
        );
    }

    private calcFull() : void {
        if((0 == this.wsAddress.length) || (0 == this.sourceUrl.length)) {
            return;
        }
        this.fullSrc = "http://" +
                       this.wsAddress +
                       ":8000/images/" +
                       this.sourceUrl;  
    }

    private onClick() : void {
        console.log("image-local onClick [" + this.sourceUrl + "]");
        this.clickImage.next(this.sourceUrl);
    }

    private cloudConnectedSubscription : Subscription ;
    private wsAddress                  : string       = "";
    private sourceUrl                  : string       = "";
}
