import {Injectable}            from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {Subject}               from 'rxjs/Subject';

import {WebsocketService}      from './websocket.service';

interface SubjectMap {
    [mi: string]: Subject<any>;
}

@Injectable()
export class WebsocketMessageService extends WebsocketService {
    /**********************************************
     * Public construction/destruction
     */
    constructor() {
        super();
        this.getObservable().subscribe(
            msg => {
                let mi: string = msg["mi"];
                if(undefined === mi) {
                    //reject
                    return;
                }
                let miSubject : Subject<any> = this.subjectMap[mi];
                if(undefined === miSubject) {
                    //no subscribers for this MI
                    console.log("Unhandled MI [" + mi + "]");
                    return;
                }
                let data: string = msg["data"];
                if(undefined === data) {
                    //reject
                    console.log("Sinking MI [" + mi + "] without data");
                    return;
                }
                miSubject.next(data);
            }, 
            error => {
                console.log("Error result in WebsocketMessageService");
            }
        );
        
    }    

    /**********************************************
     * Public methods
     */
    public sendMsg(mi: string, data: any) : void {
        //console.log("WebsocketMessageService send [" + mi + "]: " + JSON.stringify(data));
        let msg = {
            mi: mi,
            data: data
        };
        this.send(msg);
    };

    public register(mi: string) : Observable<any> {
        if(undefined == this.subjectMap[mi]) {
            this.subjectMap[mi] = new Subject<any>();
        }
        return this.subjectMap[mi].asObservable();
    }

    /**********************************************
     * Private methods
     */

    /**********************************************
     * Private members
     */
    private subjectMap : SubjectMap = {};
}
