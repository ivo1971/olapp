//avoid compilation issues because cordova libraries have no typings
declare var Camera    : any
declare var navigator : any

import {ChangeDetectorRef}    from '@angular/core';
import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'teamfie',
    styleUrls  : [
        'teamfie.component.css'
    ],
    templateUrl: 'teamfie.component.html'
})
export class TeamfieComponent extends ComponentBase implements OnInit, OnDestroy { 
    private imageContent      : string = "";
    private imageContentValid : boolean = false;
    private teamName          : string  = "";

    public constructor(
        private changeDetectorRef     : ChangeDetectorRef,
        private _websocketUserService : WebsocketUserService,
        ) { 
        super(_websocketUserService);
    }

    public ngOnInit() : void {
        this.sendLocation("teamfie");
    }

    public ngOnDestroy() : void {
    }

    private onClickTakeTeamfie() : void {
        console.log("onClickTakeTeamfie in");
        var srcType = Camera.PictureSourceType.CAMERA;
        var options = this.cameraSetOptions(srcType);
        navigator.camera.getPicture(image => {
            console.log("onClickTakeTeamfie OK [" + image.length + "]");
            this.imageContent      = image;
            this.imageContentValid = true;
            this.changeDetectorRef.detectChanges(); //trigger Angular digest cycle manually
        }, function cameraError(error) {
            console.log("onClickTakeTeamfie failed: " + error);
            this.imageContentValid = false;
            this.changeDetectorRef.detectChanges(); //trigger Angular digest cycle manually
        }, options);
        console.log("onClickTakeTeamfie out");
    }

    private onClickSubmit() : void {
        console.log("onClickSubmit [" + this.imageContent.length + "]");
        this._websocketUserService.sendMsg("teamfie", {
            name: this.teamName,
            image: this.imageContent;
        });
    }

    private cameraSetOptions(srcType: string) {
        var options = {
            // Some common settings are 20, 50, and 100
            quality: 20,
            destinationType: Camera.DestinationType.DATA_URL,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            cameraDirection: Camera.Direction.BACK,
            correctOrientation: true  //Corrects Android orientation quirks
        }
        return options;
    }
}
