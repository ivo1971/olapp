import {Component           } from '@angular/core';
import {Observable          } from 'rxjs/Observable';
import {OnInit              } from '@angular/core';
import {OnDestroy           } from '@angular/core';
import {Subscription        } from 'rxjs/Subscription';

import 'rxjs/add/operator/filter';

import {ComponentBase       } from './../../classes/component-base.class';
import {SimpleButtonInfo    } from './../../classes/simple-button-info.class';
import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';
import {calculate           } from './../../classes/simple-button-info.class';

import {EMedia              } from './../../classes/media-player.class';
import {MediaPlayer         } from './../../classes/media-player.class';
import {TeamInfo            } from './../../classes/team-info.class';
import {User                } from './../../classes/user.class';

import {ImgBase64Service    } from './../../services/img-base64.service';
import {LogService          } from './../../services/log.service';
import {ModeService, EMode  } from './../../services/mode.service';
import {TeamsUsersService   } from './../../services/teams-users.service';
import {UserService         } from './../../services/user.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button',
    styleUrls  : [
        'simple-button.component.css'
    ],
    templateUrl: 'simple-button.component.html'
})
export class SimpleButtonComponent extends ComponentBase implements OnInit, OnDestroy { 
    /* Private members
     */
    private observableTeamInfo:         Observable<Array<TeamInfo>>;
    private observableInfo:             Observable<SimpleButtonInfo>;
    private observableInfoSubscription: Subscription                ;
    private userSubscription:           Subscription                ;
    private connectedSubscription:      Subscription                ;
    private imgBase64Subscription:      Subscription                ;
    private bodyLastClass:              String                      = '';
    private bodyElement:                any                         = document.getElementsByTagName('body')[0];
    private user:                       User                        = new User();
    private pushVibrateDone:            Boolean                     = false;
    private pushHandled:                Boolean                     = false;
    private resultSoundDone:            Boolean                     = false;
    private mediaPlayer:                MediaPlayer                 = null;

    /* Private variables intended for the template
     * (hence at the top)
     */
    public modeIsBeamer:    Boolean                 = false;
    public modeIsMaster:    Boolean                 = false;
    public modeIsQuiz:      Boolean                 = true;
    public prevSequenceNbr: Number                  = 0;
    public good:            Boolean                 = false;
    public wrong:           Boolean                 = false;
    public go:              Boolean                 = false;
    public wait:            Boolean                 = false;
    public imgGo:           String                  = '';
    public imgGood:         String                  = '';
    public imgPush:         String                  = '';
    public imgWait:         String                  = '';
    public imgWrong:        String                  = '';

    /* Construction
     */
    public constructor(
      private imgBase64Service:   ImgBase64Service,
      private logService:         LogService,
      private modeService:        ModeService,
      private teamsUsersService:  TeamsUsersService,
      private userService:        UserService,
      private _websocketService:  WebsocketUserService,
      ) {
          // call base class
          super(_websocketService);

          // additional initialization
          this.mediaPlayer            = new MediaPlayer(logService);
          this.modeIsBeamer           = this.modeService.IsBeamer();
          this.modeIsMaster           = this.modeService.IsMaster();
          this.modeIsQuiz             = this.modeService.IsQuiz();
          this.observableTeamInfo     = this.teamsUsersService.getObservableTeamsInfo();

          // pre-load all images
          this.imgBase64Service.getImage(  'go.gif');
          this.imgBase64Service.getImage( 'good.gif');
          this.imgBase64Service.getImage( 'push.gif');
          this.imgBase64Service.getImage( 'wait.gif');
          this.imgBase64Service.getImage('wrong.gif');

          // subscribe to image service
          this.imgBase64Subscription = this.imgBase64Service.getObservableImgBase64().subscribe((imgBase64Map : Map<string, string>) => {
              this.imgGo    = imgBase64Map[   'go.gif'];
              this.imgGood  = imgBase64Map[ 'good.gif'];
              this.imgPush  = imgBase64Map[ 'push.gif'];
              this.imgWait  = imgBase64Map[ 'wait.gif'];
              this.imgWrong = imgBase64Map['wrong.gif'];
          });
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        // inform parent
        this.sendLocation('simple-button');

        // register routing MI
        this.observableInfo = this._websocketService
                                    .register('simple-button')
                                    .filter(data => this.filterSimpleButton(data));

        // get user info (name & team)
        this.userSubscription = this.userService.getObservableUser().subscribe(
          user => {
            this.user = user;
          });

        // subscribe here too to change the background color of the body
        // element (apparently the only ways this can be done in Angular 2 is
        // unfortunately via JavaScript calls because the body element is
        // outside the root angular element)
        this.observableInfoSubscription = this.observableInfo.subscribe(data => {
            this.handleSimpleButton(data);
        });

        // subscribe for status info,
        // when the connection is lost: reset
        // so the next incoming message will alwasy be
        // processed as the first (not rejected because
        // of the sequence number)
        this.connectedSubscription = this._websocketService.getObservableConnected().subscribe(
          connected => {
              if(!connected) {
                  this.prevSequenceNbr = 0;
                  this.reset(null);
              }
          });

        // start clean
        this.reset(null);
    }

    public ngOnDestroy() {
        // cleanup the body element
        if (0 !== this.bodyLastClass.length) {
            this.bodyElement.classList.remove(this.bodyLastClass);
        }

        // unsubscribe
        this.observableInfoSubscription.unsubscribe();
        this.userSubscription.unsubscribe();
        this.connectedSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */
    public onPush(): void {
        this.logService.log('on push [' + this.pushHandled + ']');
        // navigator.vibrate(300);
        if(this.pushHandled) {
            return;
        }
        this._websocketService.sendMsg('simple-push', {
            push: 1
        });
    }

    /* Private functions
     */
    private filterSimpleButton(data : any): boolean {
        this.logService.log('Simple button filter in');
        // check if data is available
        if (!data) {
            this.logService.error('Simple button filter sinking message without data');
            return false;
        }

        // check and handle sequence number
        const sequenceNbr = data.seqNbr;
        if (0 === sequenceNbr) {
            this.logService.log('Simple-button filter allowing reset');
            this.prevSequenceNbr = sequenceNbr;
            return true;
        } else if(this.prevSequenceNbr > sequenceNbr) {
            this.logService.warn('Simple-button filter sinking out-of-order [' + this.prevSequenceNbr + '] > [' + sequenceNbr + ']');
            return false;
        }
        this.logService.log('Simple-button filter allowing message [' + sequenceNbr + ']');
        this.prevSequenceNbr = sequenceNbr;
        return true;
    }

    // this funciont evaluates 1 incoming simple-button message.
    // It should completely evaluate the message and act on it,
    // without any history. Except for the sequence number wich
    // is required to catch potential races in the send mechanism
    // on the server.
    // Handling without history is important in case the device
    // loses connection a short time.
    private handleSimpleButton(data: SimpleButtonInfo): void {
        // handle sequence number 0
        // (do not care about out-of-sequence, they have been filtered
        //  before this point by observable.filter calling
        //  filterSimpleButton)
        const sequenceNbr = data.seqNbr;
        if(0 === data.seqNbr) {
            this.logService.warn('Simple-button reset');
            this.reset(null);
            return;
        }
        this.logService.log('Simple-button handling message [' + sequenceNbr + ']');

        // check the teams info.
        // when there are no teams: reset
        // (except the sequence number)
        if (!data.teams) {
            this.logService.log('Simple-button handling message [' + sequenceNbr + ']: no teams on the list');
            this.reset('info');
            return;
        }

        // evaluate all items on the list
        let teamOnList: Boolean = false;
        {
            let firstActiveFound: boolean = false;
            for (let u = 0 ; u < data.teams.length ; ++u) {
                // evaluate team on the list
                firstActiveFound = calculate(data.teams[u], firstActiveFound);
                this.logService.log('Simple-button handling message team ['
                                    + u
                                    + ']['
                                    + data.teams[u].good
                                    + ']['
                                    + data.teams[u].wrong
                                    + ']['
                                    + data.teams[u].go
                                    + ']['
                                    + data.teams[u].wait
                                    + ']'
                                );

                // is it this team?
                if (this.modeIsQuiz) {
                    if (this.user.team === data.teams[u].name) {
                        // team found
                        this.logService.log('Simple-button handling message MATCH team ['
                                            + u
                                            + ']['
                                            + data.teams[u].good
                                            + ']['
                                            + data.teams[u].wrong
                                            + ']['
                                            + data.teams[u].go
                                            + ']['
                                            + data.teams[u].wait
                                            + ']');
                        this.good  = data.teams[u].good ;
                        this.wrong = data.teams[u].wrong;
                        this.go    = data.teams[u].go   ;
                        this.wait  = data.teams[u].wait ;
                        teamOnList = true;

                        // set the background based upon the current state
                        if (this.good) {
                            this.backgroundSet('good');
                            this.playResult(EMedia.Applause);
                        } else if (this.wrong) {
                            this.backgroundSet('wrong');
                            this.playResult(EMedia.SadTrombone);
                        } else if (this.go) {
                            // this team is the first on the active-list
                            this.backgroundSet('go');
                            this.handleSimpleButtonVibrate();
                        } else if (this.wait) {
                            // team has pushed, but other teams
                            // are preceding it on the list
                            this.backgroundSet('wait');
                            this.handleSimpleButtonVibrate();
                        } else {
                            this.logService.log('Simple-button handling message UNHANDLED team [' 
                                                + u
                                                + ']['
                                                + this.good
                                                + ']['
                                                + this.wrong
                                                + ']['
                                                + this.go
                                                + ']['
                                                + this.wait
                                                + ']'
                                            );
                        }

                        // check if this user's button push has been registered or not
                        if(!this.pushHandled) {
                            for (let v = 0 ; v < data.teams[u].members.length ; ++v) {
                                if (this.user.name === data.teams[u].members[v]) {
                                    // user is on the list
                                    this.pushHandled = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        // final evaluation for this user's team
        if ((this.modeIsQuiz) && (!teamOnList)) {
            this.reset('info');
        }
    }

    private handleSimpleButtonVibrate(): void {
        if (!this.pushVibrateDone) {
            this.logService.log('Simple-button vibrate 2');
            navigator.vibrate(1000);
            this.pushVibrateDone = true;
        }
    }

    private playResult(media: EMedia): void {
        if (this.resultSoundDone) {
            // play once
            return;
        }
        this.mediaPlayer.Play(media);
        this.resultSoundDone    = true;
    }

    private reset(background: String): void {
        this.logService.debug('reset');
        this.good               = false;
        this.wrong              = false;
        this.go                 = false;
        this.wait               = false;
        this.pushVibrateDone    = false;
        this.pushHandled        = false;
        this.resultSoundDone    = false;
        this.backgroundSet(background);
    }

    private backgroundClear(): void {
        this.logService.debug('backgroundClear');
        if(0 !== this.bodyLastClass.length) {
            this.bodyElement.classList.remove(this.bodyLastClass);
            this.bodyLastClass = '';
        }
    }

    private backgroundSet(background: String): void {
        // handle null
        this.logService.debug('backgroundSet [' + background + ']');
        if(!background) {
            this.backgroundClear();
            return;
        }

        // detect changes to avoid needlesly changing the DOM
        const newClass: String = 'background-' + background;
        if(newClass === this.bodyLastClass) {
            this.logService.debug('backgroundSet [' + background + '] --> no change');
            return;
        }
        this.logService.debug('backgroundSet [' + this.bodyLastClass + '] --> [' + newClass + ']');

        // update the DOM
        this.backgroundClear();
        this.bodyLastClass = newClass;
        this.bodyElement.classList.add(this.bodyLastClass);
    }
}
