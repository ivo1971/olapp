import {Injectable}       from '@angular/core';

export enum EMode {
    Quiz,
    Master,
    Beamer
}

@Injectable()
export class ModeService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(
    ) {
        if(-1 !== document.URL.indexOf('beamer')) {
            this.mode = EMode.Beamer;
        } else if(-1 !== document.URL.indexOf('quizmaster')) {
            this.mode = EMode.Master;
        } else {
            //default
            this.mode = EMode.Quiz;
        }
        console.log("Running in mode [" + this.GetMode() + "]");
    } 

    public GetMode() : EMode {
        return this.mode;
    }

    private mode : EMode = EMode.Quiz;
}
