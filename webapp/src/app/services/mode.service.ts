import {Injectable} from '@angular/core';

export enum EMode {
    Unknown,
    Quiz,
    Master,
    Beamer
}

@Injectable()
export class ModeService {
    private mode: EMode   = EMode.Unknown;
    private initDone: Boolean = false;

    /* The static functions can be used in any situation,
     * but they are slower than the none-static functions
     * as they have to determine the mode everytime
     * they are called.
     */
    public static SGetMode(): EMode {
        let mode: EMode = EMode.Unknown;
        if ((-1 !== document.URL.indexOf('beamer')) || (-1 !== document.URL.indexOf(':5002/'))) {
            mode = EMode.Beamer;
        } else if ((-1 !== document.URL.indexOf('quizmaster')) || (-1 !== document.URL.indexOf(':5003/'))) {
            mode = EMode.Master;
        } else {
            // default
            mode = EMode.Quiz;
        }
        console.log('Running in mode [' + mode + ']');
        return mode;
    }

    public static SIsQuiz(): boolean {
        return EMode.Quiz === ModeService.SGetMode();
    }

    public static SIsBeamer(): boolean {
        return EMode.Beamer === ModeService.SGetMode();
    }

    public static SIsMaster(): boolean {
        const mode: EMode   = ModeService.SGetMode();
        const isMaster: boolean = EMode.Master === ModeService.SGetMode();
        console.log('SIsMaster Running in mode [' + mode + ']');
        console.log('SIsMaster Running mode SIsMaster [' + isMaster + ']');
        return isMaster;
    }

    /**********************************************
     * Public construction/destruction
     */
    constructor(
    ) {
        this.mode = ModeService.SGetMode();
    }

    public GetMode(): EMode {
        if (!this.initDone) {
            this.mode = ModeService.SGetMode();
        }
        return this.mode;
    }

    public IsQuiz(): boolean {
        if (!this.initDone) {
            this.mode = ModeService.SGetMode();
        }
        return EMode.Quiz === this.mode;
    }

    public IsBeamer(): boolean {
        if (!this.initDone) {
            this.mode = ModeService.SGetMode();
        }
        return EMode.Beamer === this.mode;
    }

    public IsMaster(): boolean {
        if (!this.initDone) {
            this.mode = ModeService.SGetMode();
        }
        return EMode.Master === this.mode;
    }
}
