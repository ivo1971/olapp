import {BehaviorSubject}       from 'rxjs/BehaviorSubject';
import {Injectable}            from '@angular/core';
import {IntervalObservable}    from 'rxjs/observable/IntervalObservable';
import {Observable}            from 'rxjs/Observable';
import {Subscription}          from 'rxjs/Subscription';

import {LogService}            from './log.service';
import {WebsocketUserService}  from './websocket.user.service';

@Injectable()
export class ImgBase64Service {
    /**********************************************
     * Public construction/destruction
     */
    constructor(
        private logService           : LogService,
        private websocketUserService : WebsocketUserService
    ) {
        this.websocketUserService.register("load-img-base64").subscribe( data => {
            this.handleImage(data["imageName"], data["imageData"]);
        });

        this.timerImgGet             = IntervalObservable.create(5000);
        this.timerImgGetSubscription = this.timerImgGet.subscribe(t => {
            this.getOpenImages();
        });
    }

    destructor() {
        if(this.timerImgGetSubscription) {
            this.timerImgGetSubscription.unsubscribe();
        }
    } 

    /**********************************************
     * Public functions
     */
    public getObservableImgBase64() : Observable<Map<string, string>> {
        return this.subjectImgBase64Map.asObservable();
    }

    public getImage(name : string) {
        if(this.imgBase64Map.has(name)) {
            //image already in the map,
            //no need to get it again
            this.logService.log("ImgBase64Service getImage name [" + name + "] already");
            return;
        }
        this.logService.log("ImgBase64Service getImage name [" + name + "] new");

        //insert new empty key/value in the map
        this.imgBase64Map.set(name, "");
        this.subjectImgBase64Map.next(this.imgBase64Map);

        //get the image from the server
        this.websocketUserService.sendMsg("load-img-base64", {
            imageName: name
        });

        //start timer when it is not running
        if(!this.timerImgGetSubscription) {
            this.timerImgGetSubscription = this.timerImgGet.subscribe(t => {
                this.getOpenImages();
            });
        }
    }

    /**********************************************
     * Private functions
     */
    private handleImage(name : string, data : string) {
        this.logService.log("ImgBase64Service handleImage name [" + name + "]");
        this.imgBase64Map[name] = data;
        this.subjectImgBase64Map.next(this.imgBase64Map);
    }

    private getOpenImages() : void {
        this.logService.log("ImgBase64Service getOpenImages in ");
        let pending : boolean = false;
        this.imgBase64Map.forEach((name: string, data: string) => {
            if(0 != data.length) {
                return;
            }
            this.getImage(name);
            pending = true;
        });
        if(!pending) {
            //stop timer
            if(this.timerImgGetSubscription) {
                this.logService.log("ImgBase64Service getOpenImages timer stopped");
                this.timerImgGetSubscription.unsubscribe();
                this.timerImgGetSubscription = null;
            }
        }
        this.logService.log("ImgBase64Service getOpenImages out");
    }

    /**********************************************
     * Private members
     */
     private imgBase64Map            : Map<string, string> = new Map<string, string>();
     private subjectImgBase64Map     : BehaviorSubject<Map<string, string>> = new BehaviorSubject<Map<string, string>>(this.imgBase64Map);
     private timerImgGet             : Observable<number>;
     private timerImgGetSubscription : Subscription;
}
