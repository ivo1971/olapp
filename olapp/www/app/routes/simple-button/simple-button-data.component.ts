import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';
import {Subscription}          from 'rxjs/Subscription';

import {SimpleButtonInfo}      from './../../classes/simple-button-info.class';
import {SimpleButtonTeamInfo}  from './../../classes/simple-button-info.class';

import {ImgBase64Service}      from './../../services/img-base64.service';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button-data',
    styleUrls  : [
        'simple-button-data.component.css'
    ],
    templateUrl: 'simple-button-data.component.html'
})
export class SimpleButtonComponentData  { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    @Input() data           : SimpleButtonTeamInfo    ;
    private imgGo           : string                  = "";
    private imgGood         : string                  = "";
    private imgWait         : string                  = "";
    private imgWrong        : string                  = "";

    /* Construction
     */
    public constructor(
      private imgBase64Service  : ImgBase64Service,
      ) {
          //pre-load all images
          this.imgBase64Service.getImage(  "go.gif");
          this.imgBase64Service.getImage( "good.gif");
          this.imgBase64Service.getImage( "wait.gif");
          this.imgBase64Service.getImage("wrong.gif");

          //subscribe to image service
          this.imgBase64Subscription = this.imgBase64Service.getObservableImgBase64().subscribe((imgBase64Map : Map<string, string>) => {
              this.imgGo    = imgBase64Map[   "go.gif"];
              this.imgGood  = imgBase64Map[ "good.gif"];
              this.imgWait  = imgBase64Map[ "wait.gif"];
              this.imgWrong = imgBase64Map["wrong.gif"];
          });
    }

    /* Private members
     */
    private imgBase64Subscription      : Subscription                ;
}
