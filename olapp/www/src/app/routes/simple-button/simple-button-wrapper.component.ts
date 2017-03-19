import {Component}             from '@angular/core';

import {ModeService, EMode}    from './../../services/mode.service';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button-wrapper',
    styleUrls  : [
    ],
    templateUrl: 'simple-button-wrapper.component.html'
})
export class SimpleButtonWrapperComponent { 
    public isBeamer: boolean = false;
    public isMaster: boolean = false;
    public isQuiz:   boolean = false;

    /* Construction
     */
    public constructor(

        private modeService: ModeService,
        ) { 
            this.isBeamer = this.modeService.IsBeamer()
            this.isMaster = this.modeService.IsMaster()
            this.isQuiz   = this.modeService.IsQuiz  ()
    }
}
 