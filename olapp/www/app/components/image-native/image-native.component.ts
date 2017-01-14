import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';
import {OnInit}                from '@angular/core';

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
    public    fullSrc  : string = "";

    public constructor() {
    }

    public ngOnInit() : void {
        var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        if (app) {
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
