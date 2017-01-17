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
        this.mode = ModeService.SGetMode();
        console.log("Running in mode [" + this.GetMode() + "]");
    } 

    public GetMode() : EMode {
        return this.mode;
    }

    public IsQuiz() : boolean {
        return EMode.Quiz == this.mode;
    }

    public IsBeamer() : boolean {
        return EMode.Beamer == this.mode;
    }

    public IsMaster() : boolean {
        return EMode.Master == this.mode;
    }

    /* The static functions can be used in any situation,
     * but they are slower than the none-static functions
     * as they have to determine the mode everytime
     * they are called.
     */
    public static SGetMode() : EMode {
        let mode : EMode;
        if(-1 !== document.URL.indexOf('beamer')) {
            mode = EMode.Beamer;
        } else if(-1 !== document.URL.indexOf('quizmaster')) {
            mode = EMode.Master;
        } else {
            //default
            mode = EMode.Quiz;
        }
        console.log("Running in mode [" + mode + "]");
        return mode;
    }

    public static SIsQuiz() : boolean {
        return EMode.Quiz == ModeService.SGetMode();
    }

    public static SIsBeamer() : boolean {
        return EMode.Beamer == ModeService.SGetMode();
    }

    public static SIsMaster() : boolean {
        let mode     : EMode   = ModeService.SGetMode();
        let isMaster : boolean = EMode.Master == ModeService.SGetMode();
        console.log("SIsMaster Running in mode [" + mode + "]");
        console.log("SIsMaster Running mode SIsMaster [" + isMaster + "]");
        return isMaster;
    }

    private mode : EMode = EMode.Quiz;
}
