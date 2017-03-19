import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';
import {OnInit}                from '@angular/core';

import {IsCordova}             from './../../help/cordova';

import {LogService }           from './../../services/log.service';

@Component({
  moduleId   : module.id,
  selector   : 'image-teamfie',
  templateUrl: 'image-teamfie.component.html'
})
export class ImageTeamfieComponent implements OnInit { 
    /* Input and view members
     */
    @Input()  image          : string = "";
    @Input()  imageWidth     : number = -1;
    @Input()  imageHeight    : number = -1;
    @Input()  viewWidth      : number = -1;
    @Input()  viewHeight     : number = -1;
    public    calcImage      : string = "";
    public    calcWidth      : number = -1;
    public    calcHeight     : number = -1;

    /* Construction
     */
    public constructor(
        private logService             : LogService
        ) {
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        //source
        if(0 == this.image.indexOf("img")) {
            //native image 
            if(IsCordova()) {
                //Cordova application
                this.calcImage = "file:///android_asset/www/" + this.image;  
            } else {
                //Web page
                this.calcImage = "./" + this.image;
            } 
        } else {
            //base64 --> keep it as it is
            this.calcImage = this.image;
        }
        //scale
        if((-1 == this.viewWidth) && (-1 == this.viewHeight)) {
            this.initViewNone();
        } else if((-1 != this.viewWidth) && (-1 == this.viewHeight)) {
            this.initViewWidthOnly();
        } else if((-1 == this.viewWidth) && (-1 != this.viewHeight)) {
            this.initViewHeightOnly();
        } else {
            this.initViewWidthAndHeight();
        }
    }

    /* Help functions
     */
    private initViewNone() : void {
        if((-1 == this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewNoneImageNone();
        } else if((-1 != this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewNoneImageHeightOnly();
        } else if((-1 == this.imageWidth) && (-1 != this.imageHeight)) {
            this.initViewNoneImageWidthOnly();
        } else {
            this.initViewNoneImageWidthAndHeigth();
        }
    }

    private initViewWidthOnly() : void {
        if((-1 == this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewWidthOnlyImageNone();
        } else if((-1 != this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewWidthOnlyImageHeightOnly();
        } else if((-1 == this.imageWidth) && (-1 != this.imageHeight)) {
            this.initViewWidthOnlyImageWidthOnly();
        } else {
            this.initViewWidthOnlyImageWidthAndHeigth();
        }
    }

    private initViewHeightOnly() : void {
        if((-1 == this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewHeightOnlyImageNone();
        } else if((-1 != this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewHeightOnlyImageHeightOnly();
        } else if((-1 == this.imageWidth) && (-1 != this.imageHeight)) {
            this.initViewHeightOnlyImageWidthOnly();
        } else {
            this.initViewHeightOnlyImageWidthAndHeigth();
        }
    }

    private initViewWidthAndHeight() : void {
        if((-1 == this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewWidthAndHeightImageNone();
        } else if((-1 != this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewWidthAndHeightImageHeightOnly();
        } else if((-1 == this.imageWidth) && (-1 != this.imageHeight)) {
            this.initViewWidthAndHeightImageWidthOnly();
        } else {
            this.initViewWidthAndHeightImageWidthAndHeigth();
        }
    }

    private initViewNoneImageNone() : void {
        this.calcWidth  = -1;
        this.calcHeight = -1;
    }

    private initViewNoneImageWidthOnly() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewNoneImageHeightOnly() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewNoneImageWidthAndHeigth() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewWidthOnlyImageNone() : void {
        this.calcWidth  = this.viewWidth;
        this.calcHeight = -1;
    }

    private initViewWidthOnlyImageWidthOnly() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewWidthOnlyImageHeightOnly() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewWidthOnlyImageWidthAndHeigth() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewHeightOnlyImageNone() : void {
        this.calcWidth  = -1;
        this.calcHeight = this.viewHeight;
    }

    private initViewHeightOnlyImageWidthOnly() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewHeightOnlyImageHeightOnly() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewHeightOnlyImageWidthAndHeigth() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewWidthAndHeightImageNone() : void {
        //cannot respect ratio
        this.calcWidth  = this.viewWidth;
        this.calcHeight = this.viewHeight;
    }

    private initViewWidthAndHeightImageWidthOnly() : void {
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewWidthAndHeightImageHeightOnly() : void {
        //not implemented
        this.logService.error("not implemented");
        this.calcWidth  = 0;
        this.calcHeight = 0;
    }

    private initViewWidthAndHeightImageWidthAndHeigth() : void {
        //this.logService.log("imput [" + this.viewWidth + "][" + this.imageWidth + "]  [" + this.viewHeight + "][" + this.imageHeight + "]");
        let ratioWidth  : number = this.viewWidth  / this.imageWidth ;
        let ratioHeight : number = this.viewHeight / this.imageHeight;
        let ratio       : number = 1;
        if(ratioWidth < ratioHeight) {
            ratio = ratioWidth;
        } else {
            ratio = ratioHeight;
        }
        //this.logService.log("rescale ratio [" + ratioWidth + "][" + ratioHeight + "] [" + ratio + "]");
        this.calcWidth  = this.imageWidth  * ratio;
        this.calcHeight = this.imageHeight * ratio;
        //this.logService.log("rescale size [" + this.calcWidth + "][" + this.calcHeight + "]");
    }

    private (val1 : number, val2 : number) {
        if(val1 > val2) {
            return val1;
        } else {
            return val2;
        }
    }

    private min(val1 : number, val2 : number) {
        if(val1 < val2) {
            return val1;
        } else {
            return val2;
        }
    }
}
