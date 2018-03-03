import {Component}             from '@angular/core';

import {ModeService, EMode}    from './../../services/mode.service';

@Component({
    moduleId   : module.id,
    selector   : 'questions-wrapper',
    styleUrls  : [
    ],
    templateUrl: 'questions-wrapper.component.html'
})
export class QuestionsWrapperComponent { 
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
 