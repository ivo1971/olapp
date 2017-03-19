/*
 * Source: https://medium.com/@mithun_daa/drag-and-drop-in-angular-2-using-native-html5-api-f628ce4edc3b#.f9thtvlmk
 * 
 */
import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'sort-images',
    styleUrls  : [
        'sort-images.component.css'
    ],
    templateUrl: 'sort-images.component.html'
})
export class SortImagesComponent extends ComponentBase { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    private draggingIdxNone : number = -1;
    private draggingIdx     : number = this.draggingIdxNone; 
    private imagesSort      : string[]  = [];
    private imagesResultOk  : boolean[] = [];
    private imagesResultErr : boolean[] = [];
    private imagesNbrOk     : number    = 0;
    private imagesNbrTotal  : number    = 0;
    private imagesNbrShow   : boolean   = false;

    /* Construction
     */
    public constructor(
        private logService             : LogService,
        private modeService            : ModeService,
        private _websocketUserService : WebsocketUserService,
        ) { 
        //call base class
        super(_websocketUserService);

        //inform parent
        this.sendLocation("sort");
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        //register routing MI
        this.observableImagesListRandom = this._websocketUserService
                                             .register("sort-images-list-random")
        this.observableImagesListRandomSubscription = this.observableImagesListRandom.subscribe(
            data => {
                //stop dragging
                this.draggingIdx = this.draggingIdxNone; 

                if(0 == this.imagesSort.length) {
                  //initialization
                  this.imagesResultOk.length  = 0;
                  this.imagesResultErr.length = 0;
                  for(let u : number = 0 ; u < data.images.length ; ++u) {
                      this.imagesSort.push(data.images[u]);
                      this.imagesResultOk.push(false);
                      this.imagesResultErr.push(false);
                  }
                } else {
                  //other team member changed the order
                  //(assume there is no change in the size of the list)
                  //(this is an update --> change as little as possible in the array)
                  for(let u : number = 0 ; u < data.images.length ; ++u) {
                      if(this.imagesSort[u] !== data.images[u]) {
                          this.imagesSort[u] = data.images[u];
                      }
                  }
                }
            }
        );

        this.observableImagesListResult = this._websocketUserService
                                             .register("sort-images-list-result")
        this.observableImagesListResultSubscription = this.observableImagesListResult.subscribe(
            data => {
                //stop dragging
                this.draggingIdx = this.draggingIdxNone; 

                if(data.sort) {
                    //start sorting again
                    //(clear ok/error classifications)
                    for(let u : number = 0 ; u < this.imagesSort.length ; ++u) {
                        this.imagesResultOk[u]  = false;
                        this.imagesResultErr[u] = false;
                    }
                    this.imagesNbrShow  = false;
                    console.log(this.imagesSort);
                    console.log(this.imagesResultOk);
                    console.log(this.imagesResultErr);
                } else {
                    this.imagesNbrShow  = true;
                    this.imagesNbrOk    = 0;
                    this.imagesNbrTotal = 0;
                    //show the results
                    let solutionImages: Array<string>;
                    for(let u : number = 0 ; u < data.teams.length ; ++u) {
                        if("solution" == data.teams[u]["teamId"]) {
                            solutionImages = data.teams[u].images[0];
                        }
                    }
                    for(let u : number = 0 ; u < this.imagesSort.length ; ++u) {
                        ++this.imagesNbrTotal;
                        if("undefined" !== typeof(solutionImages[u])) {
                            if(this.imagesSort[u] == solutionImages[u]) {
                                ++this.imagesNbrOk;        
                                this.imagesResultOk[u]  = true ;
                                this.imagesResultErr[u] = false;
                            } else {
                                this.imagesResultOk[u]  = false;
                                this.imagesResultErr[u] = true ;
                            }
                        } else {
                                this.imagesResultOk[u]  = false;
                                this.imagesResultErr[u] = false;
                        }
                    }
                }
            }
        );
    }

    public ngOnDestroy() : void {
        this.observableImagesListRandomSubscription.unsubscribe();
        this.observableImagesListResultSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */
    private onClickImage(imageIdx : number): void {
        if(this.imagesNbrShow) {
            //not in sorting mode,
            //no drag & drop
            return;
        }

        if(this.draggingIdx == imageIdx) {
            //click on the image being dragged
            //--> stop drag
            this.draggingIdx = this.draggingIdxNone;
        } else if(this.draggingIdx != this.draggingIdxNone) {
            //dragging in-progress,
            //but image is no drop zone
            //--> ignore
        } else {
            //start dragging
            this.draggingIdx = imageIdx;
        }
    }

    private onClickDrop(dropIdx : number): void {
        //handle drop
        let changed : boolean = false;
        if(this.draggingIdx == this.draggingIdxNone) {
            //no drag in-progress
            //--> ignore
        } else if(this.draggingIdx == dropIdx) {
            //drop at the same location as the drag started
            //--> stop drag
            this.draggingIdx = this.draggingIdxNone;
        } else {
            //drop
            this.imagesSort.splice(dropIdx, 0, this.imagesSort[this.draggingIdx]);
            if(this.draggingIdx < dropIdx) {
                this.imagesSort.splice(this.draggingIdx,     1);
            } else {
                this.imagesSort.splice(this.draggingIdx + 1, 1);
            }
            this.draggingIdx = this.draggingIdxNone;
            changed = true;
        }

        if(changed) {
           this._websocketUserService.sendMsg("sort-images-list-team", {
              images: this.imagesSort
           });
        }
    }

    /* Private functions
     */

    /* Private members
     */
    private observableImagesListRandom               : Observable<any>;
    private observableImagesListRandomSubscription   : Subscription;
    private observableImagesListResult               : Observable<any>;
    private observableImagesListResultSubscription   : Subscription;
}
