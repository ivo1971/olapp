//avoid compilation issues because cordova libraries have no typings
declare var Camera    : any
declare var navigator : any

import {ChangeDetectorRef}    from '@angular/core';
import {Component}            from '@angular/core';
import {IntervalObservable}   from 'rxjs/observable/IntervalObservable';
import {Observable}           from 'rxjs/Observable';
import {Subscription}         from 'rxjs/Subscription';

import {TeamfieBaseComponent} from './../../classes/teamfie-base.class';

import {TeamInfo}             from './../../classes/team-info.class';
import {Teamfie}              from './../../classes/teamfie.class';

import {ModeService}          from './../../services/mode.service';
import {TeamfieService}       from './../../services/teamfie.service';
import {TeamsUsersService}    from './../../services/teams-users.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'teamfie',
    styleUrls  : [
        'teamfie.component.css'
    ],
    templateUrl: 'teamfie.component.html'
})
export class TeamfieComponent extends TeamfieBaseComponent { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    private modeIsBeamer      : boolean = false;
    private modeIsMaster      : boolean = false;
    private modeIsQuiz        : boolean = true;
    private imageContent      : string = "";
    private imageContentValid : boolean = false;
    private teamName          : string  = "";
    private carouselActive    : boolean = false;

    /* Construction
     */
    public constructor(
        private changeDetectorRef     : ChangeDetectorRef,
        private modeService           : ModeService,
        private _teamfieService        : TeamfieService,
        private _teamsUsersService     : TeamsUsersService,
        private __websocketUserService : WebsocketUserService,
        ) { 
        //call base class
        super(_teamfieService, _teamsUsersService,__websocketUserService);

        //additional initialization
        this.modeIsBeamer           = this.modeService.IsBeamer();
        this.modeIsMaster           = this.modeService.IsMaster();
        this.modeIsQuiz             = this.modeService.IsQuiz();
        this.carouselActive         = this.modeIsMaster;

        //send location
        this.sendLocation("teamfie");

        //subscribe
        this.observableCarouselOnBeamer   = this.__websocketUserService
                                            .register("teamfie-carousel-on-beamer");
        this.subscriptionCarouselOnBeamer = this.observableCarouselOnBeamer.subscribe((data: any) => {
            this.carouselActive = data["enable"];
        });

        //start carousel timer
        this.timerCarousel = IntervalObservable.create(3000);
        this.timerCarouselSubscription = this.timerCarousel.subscribe(t => {
            ++this.activeTeamIdx;
            if(this.activeTeamIdx >= this.teamInfos.length) {
                this.activeTeamIdx = 0;
            }
        });
    }

    public destructor() : void {
        this.timerCarouselSubscription.unsubscribe();
        this.subscriptionCarouselOnBeamer.unsubscribe();
    }

    /* Template event handlers
     */
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
        this.__websocketUserService.sendMsg("teamfie", {
            name: this.teamName,
            image: this.imageContent,
        });

      //idea: send as binary data (instead of string)
      //      --> seasocks has no size limit
      //client.on('data', function (data) {
      //  console.log('data');
      //  ws.send(data, { binary: true });
      //});

      //idea: compress image before sending
      //      http://stackoverflow.com/questions/20958078/resize-a-base-64-image-in-javascript-without-using-canvas
    }

    private onCheckboxCarouselOnBeamer() : void {
        this.carouselOnBeamer = !this.carouselOnBeamer;
        this.__websocketUserService.sendMsg("teamfie-carousel-on-beamer", {
            enable: this.carouselOnBeamer
        });
    }
    
    private isTeamActive(teamId : string) : boolean {
        return teamId === this.teamInfos[this.activeTeamIdx].id;
    }

    /* Help functions
     */
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

    /* Private members
     */
    private observableCarouselOnBeamer     : Observable<any>;
    private subscriptionCarouselOnBeamer   : Subscription;
    private timerCarousel                  : any;
    private timerCarouselSubscription      : Subscription;
    private activeTeamIdx                  : number = 0;
    private carouselOnBeamer               : boolean = false;
}
