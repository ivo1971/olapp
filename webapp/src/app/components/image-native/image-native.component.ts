import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';
import {OnInit}                from '@angular/core';

import {IsCordova}             from './../../help/cordova';

@Component({
  moduleId   : module.id,
  selector   : 'image-native',
  styleUrls  : [
      'image-native.component.css',
  ],
  templateUrl: 'image-native.component.html'
})
export class ImageNativeComponent implements OnInit { 
    @Input()  source   : string;
    @Input()  width    : string = "100%";
    public    fullSrc  : string = "";

    public constructor() {
    }

    public ngOnInit() : void {
        if(IsCordova()) {
            //Cordova application
            this.fullSrc = "file:///android_asset/www/" +
                            this.source;  
        } else {
            //Web page
            this.fullSrc = "./" +
                            this.source;  
        } 
    }
}
