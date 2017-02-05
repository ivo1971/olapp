import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';
import {OnInit}                from '@angular/core';

import {IsCordova}             from './../../help/cordova';

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
    @Input()  viewMaxWidth   : number = -1;
    @Input()  viewMaxHeight  : number = -1;
    private   calcImage      : string = "";
    private   calcWidth      : number = -1;
    private   calcHeight     : number = -1;

    /* Construction
     */
    public constructor() {
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
        if((-1 == this.viewMaxWidth) && (-1 == this.viewMaxHeight)) {
            this.initViewMaxNone();
        } else if((-1 != this.viewMaxWidth) && (-1 == this.viewMaxHeight)) {
            this.initViewMaxWidthOnly();
        } else if((-1 == this.viewMaxWidth) && (-1 != this.viewMaxHeight)) {
            this.initViewMaxHeightOnly();
        } else {
            this.initViewMaxWidthAndHeight();
        }
    }

    /* Help functions
     */
    private initViewMaxNone() : void {
        if((-1 == this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewMaxNoneImageNone();
        } else if((-1 != this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewMaxNoneImageHeightOnly();
        } else if((-1 == this.imageWidth) && (-1 != this.imageHeight)) {
            this.initViewMaxNoneImageWidthOnly();
        } else {
            this.initViewMaxNoneImageWidthAndHeigth();
        }
    }

    private initViewMaxWidthOnly() : void {
        if((-1 == this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewMaxWidthOnlyImageNone();
        } else if((-1 != this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewMaxWidthOnlyImageHeightOnly();
        } else if((-1 == this.imageWidth) && (-1 != this.imageHeight)) {
            this.initViewMaxWidthOnlyImageWidthOnly();
        } else {
            this.initViewMaxWidthOnlyImageWidthAndHeigth();
        }
    }

    private initViewMaxHeightOnly() : void {
        if((-1 == this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewMaxHeightOnlyImageNone();
        } else if((-1 != this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewMaxHeightOnlyImageHeightOnly();
        } else if((-1 == this.imageWidth) && (-1 != this.imageHeight)) {
            this.initViewMaxHeightOnlyImageWidthOnly();
        } else {
            this.initViewMaxHeightOnlyImageWidthAndHeigth();
        }
    }

    private initViewMaxWidthAndHeight() : void {
        if((-1 == this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewMaxWidthAndHeightImageNone();
        } else if((-1 != this.imageWidth) && (-1 == this.imageHeight)) {
            this.initViewMaxWidthAndHeightImageHeightOnly();
        } else if((-1 == this.imageWidth) && (-1 != this.imageHeight)) {
            this.initViewMaxWidthAndHeightImageWidthOnly();
        } else {
            this.initViewMaxWidthAndHeightImageWidthAndHeigth();
        }
    }

    private initViewMaxNoneImageNone() : void {
        this.calcWidth  = -1;
        this.calcHeight = -1;
    }

    private initViewMaxNoneImageWidthOnly() : void {
        this.calcWidth  = this.imageWidth;
        this.calcHeight = -1;
    }

    private initViewMaxNoneImageHeightOnly() : void {
        this.calcWidth  = -1;
        this.calcHeight = this.imageHeight;
    }

    private initViewMaxNoneImageWidthAndHeigth() : void {
        this.calcWidth  = this.imageWidth;
        this.calcHeight = this.imageHeight;
    }

    private initViewMaxWidthOnlyImageNone() : void {
        this.calcWidth  = this.viewMaxWidth;
        this.calcHeight = -1; //html will keep the ratio
    }

    private initViewMaxWidthOnlyImageWidthOnly() : void {
        this.calcWidth  = this.min(this.imageWidth, this.viewMaxWidth);
        this.calcHeight = -1; //html will keep the ratio
    }

    private initViewMaxWidthOnlyImageHeightOnly() : void {
        this.calcWidth  = this.viewMaxWidth;
        this.calcHeight = -1; //html will keep the ratio
    }

    private initViewMaxWidthOnlyImageWidthAndHeigth() : void {
        this.calcWidth  = this.min(this.imageWidth, this.viewMaxWidth);
        this.calcHeight = -1; //html will keep the ratio
    }

    private initViewMaxHeightOnlyImageNone() : void {
        this.calcWidth  = -1; //html will keep the ratio
        this.calcHeight = this.viewMaxHeight;
    }

    private initViewMaxHeightOnlyImageWidthOnly() : void {
        this.calcWidth  = -1; //html will keep the ratio
        this.calcHeight = this.viewMaxHeight;
    }

    private initViewMaxHeightOnlyImageHeightOnly() : void {
        this.calcWidth  = -1; //html will keep the ratio
        this.calcHeight = this.min(this.imageHeight, this.viewMaxHeight);
    }

    private initViewMaxHeightOnlyImageWidthAndHeigth() : void {
        this.calcWidth  = -1; //html will keep the ratio
        this.calcHeight = this.min(this.imageHeight, this.viewMaxHeight);
    }

    private initViewMaxWidthAndHeightImageNone() : void {
        //cannot respect ratio
        this.calcWidth  = this.viewMaxWidth;
        this.calcHeight = this.viewMaxHeight;
    }

    private initViewMaxWidthAndHeightImageWidthOnly() : void {
        //not implemented
        this.calcWidth  = -1;
        this.calcHeight = -1;
    }

    private initViewMaxWidthAndHeightImageHeightOnly() : void {
        //not implemented
        this.calcWidth  = -1;
        this.calcHeight = -1;
    }

    private initViewMaxWidthAndHeightImageWidthAndHeigth() : void {
        //console.log("imput [" + this.viewMaxWidth + "][" + this.imageWidth + "]  [" + this.viewMaxHeight + "][" + this.imageHeight + "]");
        let ratioWidth  : number = this.viewMaxWidth  / this.imageWidth ;
        let ratioHeight : number = this.viewMaxHeight / this.imageHeight;
        let ratio       : number = 1;
        if(ratioWidth < ratioHeight) {
            ratio = ratioWidth;
        } else {
            ratio = ratioHeight;
        }
        //console.log("rescale ratio [" + ratioWidth + "][" + ratioHeight + "] [" + ratio + "]");
        this.calcWidth  = this.imageWidth  * ratio;
        this.calcHeight = this.imageHeight * ratio;
        //console.log("rescale size [" + this.calcWidth + "][" + this.calcHeight + "]");
    }

    private max(val1 : number, val2 : number) {
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
