//avoid compilation issues because cordova libraries have no typings
declare var Camera    : any
declare var navigator : any

import {ChangeDetectorRef}     from '@angular/core';
import {Component}             from '@angular/core';
import {IntervalObservable}    from 'rxjs/observable/IntervalObservable';
import {Observable}            from 'rxjs/Observable';
import {Subscription}          from 'rxjs/Subscription';

import {TeamfieBaseComponent}  from './../../classes/teamfie-base.class';

import {TeamInfo}              from './../../classes/team-info.class';
import {Teamfie}               from './../../classes/teamfie.class';
import {User}                  from './../../classes/user.class';

import {LogService }           from './../../services/log.service';
import {ModeService}           from './../../services/mode.service';
import {TeamfieService}        from './../../services/teamfie.service';
import {TeamsUsersService}     from './../../services/teams-users.service';
import {UserService }          from './../../services/user.service';
import {WebsocketUserService}  from './../../services/websocket.user.service';

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
    private sending           : boolean = false;
    private sendingFailed     : boolean = false;
    private sendingOk         : boolean = false;

    /* Construction
     */
    public constructor(
        private changeDetectorRef      : ChangeDetectorRef,
        private logService             : LogService,
        private modeService            : ModeService,
        private _teamfieService        : TeamfieService,
        private _teamsUsersService     : TeamsUsersService,
        private userService            : UserService,
        private __websocketUserService : WebsocketUserService,
        ) { 
        /* call base class */
        super(_teamfieService, _teamsUsersService,__websocketUserService);

        /* additional initialization */
        this.modeIsBeamer           = this.modeService.IsBeamer();
        this.modeIsMaster           = this.modeService.IsMaster();
        this.modeIsQuiz             = this.modeService.IsQuiz();
        this.carouselActive         = this.modeIsMaster;

        /* send location */
        this.sendLocation("teamfie");

        /* subscribe */
        //get team info
        this.userSubscription = this.userService.getObservableUser().subscribe((user:User) => {
            this.teamName = user.team;
        });
        //beamer: check when the carousel has to be activated/deactivated
        this.observableCarouselOnBeamer   = this.__websocketUserService
                                            .register("teamfie-carousel-on-beamer");
        this.subscriptionCarouselOnBeamer = this.observableCarouselOnBeamer.subscribe((data: any) => {
            this.carouselActive = data["enable"];
        });
        //app: handle teamfie-received
        this.observableTeamfieReceived   = this.__websocketUserService
                                            .register("teamfie-received");
        this.subscriptionTeamfieReceived = this.observableTeamfieReceived.subscribe((data: any) => {
            this.sending   = false;
            this.sendingOk = true;
            if(this.timerSendingFailedSubscription) {
                this.timerSendingFailedSubscription.unsubscribe();
            }
            if(this.timerSendingSubscription) {
                this.timerSendingSubscription.unsubscribe();
            }
            this.timerSendingOk = IntervalObservable.create(2000);
            this.timerSendingOkSubscription = this.timerSendingOk.subscribe(t => {
                this.timerSendingOkSubscription.unsubscribe();
                this.sendingOk = false;
            });
        });

        /* start carousel timer */
        this.timerCarousel = IntervalObservable.create(3000);
        this.timerCarouselSubscription = this.timerCarousel.subscribe(t => {
            ++this.activeTeamIdx;
            if(this.activeTeamIdx >= this.teamInfos.length) {
                this.activeTeamIdx = 0;
            }
        });
    }

    public destructor() : void {
        if(this.timerSendingOkSubscription) {
            this.timerSendingOkSubscription.unsubscribe();
        }
        if(this.timerSendingFailedSubscription) {
            this.timerSendingFailedSubscription.unsubscribe();
        }
        if(this.timerSendingStartSubscription) {
            this.timerSendingStartSubscription.unsubscribe();
        }
        if(this.timerSendingSubscription) {
            this.timerSendingSubscription.unsubscribe();
        }
        if(this.timerCarouselSubscription) {
            this.timerCarouselSubscription.unsubscribe();
        }
        if(this.subscriptionCarouselOnBeamer) {
            this.subscriptionCarouselOnBeamer.unsubscribe();
        }
        if(this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    /* Template event handlers
     */
    //app function: the button to capture a teamfie has been clicked
    private onClickTakeTeamfie() : void {
        this.logService.log("onClickTakeTeamfie in");
        var srcType = Camera.PictureSourceType.CAMERA;
        var options = this.cameraSetOptions(srcType);
        navigator.camera.getPicture(image => {
            this.logService.log("onClickTakeTeamfie OK [" + image.length + "]");
            this.imageContent      = image;
            this.imageContentValid = true;
            this.changeDetectorRef.detectChanges(); //trigger Angular digest cycle manually
        }, function cameraError(error) {
            this.logService.log("onClickTakeTeamfie failed: " + error);
            this.imageContentValid = false;
            this.changeDetectorRef.detectChanges(); //trigger Angular digest cycle manually
        }, options);
    }

    //app function: the button to send the teamfie to the server has been clicked
    private onClickSubmit() : void {
        this.logService.log("onClickSubmit capture size: [" + this.imageContent.length + "]");
        this.sending = true;

        this.timerSendingStart = IntervalObservable.create(100);
        this.timerSendingStartSubscription = this.timerSendingStart.subscribe(t => {
            //one-shot
            this.timerSendingStartSubscription.unsubscribe();

            //compress the image before sending (seasockets limitation,  or at least: my understanding of it after testing...)
            //(according to http://stackoverflow.com/questions/20958078/resize-a-base-64-image-in-javascript-without-using-canvas)
            let img = document.createElement('img');
            img.onload = () => {
                //create an off-screen canvas
                let canvas     : HTMLCanvasElement        = document.createElement('canvas');
                let ctx        : CanvasRenderingContext2D = canvas.getContext('2d');
                let compressed : string                   = "";

                //iterate untill the compressed image is small enough
                for(let factor : number = 1 ; factor > 0 ; factor -= 0.05) {
                    //set its dimension to target size
                    canvas.width = img.naturalWidth * factor;
                    canvas.height = img.naturalHeight * factor;

                    //draw source image into the off-screen canvas:
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    //encode image to data-uri with base64 version of compressed image
                    compressed = canvas.width + "," + canvas.height + "," + canvas.toDataURL('image/jpeg', factor);

                    //target size reached?
                    if(100000 >= compressed.length) {
                        //yes
                        this.logService.log("onClickSubmit compressed size: [" + compressed.length + "]");
                        break;
                    }
                }

                //send
                this.__websocketUserService.sendMsg("teamfie", {
                    name:  this.teamName,
                    image: compressed
                });

                //start sending timers
                this.timerSending = IntervalObservable.create(5000);
                this.timerSendingSubscription = this.timerSending.subscribe(t => {
                    this.timerSendingSubscription.unsubscribe();
                    if(this.timerSendingOkSubscription) {
                        this.timerSendingOkSubscription.unsubscribe();
                    }
                    this.sendingFailed = true;
                });
                this.timerSendingFailed = IntervalObservable.create(7100);
                this.timerSendingFailedSubscription = this.timerSendingFailed.subscribe(t => {
                    this.timerSendingFailedSubscription.unsubscribe();
                    if(this.timerSendingOkSubscription) {
                        this.timerSendingOkSubscription.unsubscribe();
                    }
                    this.sending       = false;
                    this.sendingFailed = false;
                });
            }
            img.src = 'data:image/png;base64,' + this.imageContent;
        });
    }

    //master function: the checkbox to show teamfies on the beamer or not
    //                 has toggled.
    private onCheckboxCarouselOnBeamer() : void {
        this.carouselOnBeamer = !this.carouselOnBeamer;
        this.__websocketUserService.sendMsg("teamfie-carousel-on-beamer", {
            enable: this.carouselOnBeamer
        });
    }
    
    //master & beamer carousel: select the current image which is visible
    //                          ('active') in the carousel.
    private isTeamActive(teamId : string) : boolean {
        return teamId === this.teamInfos[this.activeTeamIdx].id;
    }

    /* Help functions
     */
    //app function: set the camera options to capture a teamfie
    private cameraSetOptions(srcType: string) {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: srcType, //camera or photo gallery
            encodingType: Camera.EncodingType.JPG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            cameraDirection: Camera.Direction.BACK,
            correctOrientation: true  //corrects Android orientation quirks
        }
        return options;
    }

    /* Private members
     */
    private userSubscription               : Subscription;
    private observableCarouselOnBeamer     : Observable<any>;
    private subscriptionCarouselOnBeamer   : Subscription;
    private observableTeamfieReceived      : Observable<any>;
    private subscriptionTeamfieReceived   : Subscription;
    private timerCarousel                  : any;
    private timerCarouselSubscription      : Subscription;
    private timerSending                   : any;
    private timerSendingSubscription       : Subscription;
    private timerSendingStart              : any;
    private timerSendingStartSubscription  : Subscription;
    private timerSendingFailed             : any;
    private timerSendingFailedSubscription : Subscription;
    private timerSendingOk                 : any;
    private timerSendingOkSubscription     : Subscription;
    private activeTeamIdx                  : number = 0;
    private carouselOnBeamer               : boolean = false;
    private teamId                         : string = "";
}
