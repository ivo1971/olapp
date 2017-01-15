import {Pipe, PipeTransform}            from '@angular/core';

import {ModeService, EMode}    from './../../services/mode.service';

import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';

@Pipe({
    name: 'simpleButtonActiveFilter',
    pure: false
})
export class SimpleButtonActiveFilter implements PipeTransform {
    /* Construction
     */
    public constructor(
      private modeService       : ModeService,
      ) {
          this.modeIsQuiz = modeService.IsQuiz();
    }

    /* Transform
     */
    transform(items: SimpleButtonTeamInfo[]): SimpleButtonTeamInfo[] {
        if(!items) return [];
        if(this.modeIsQuiz) {
            return items.filter(item => item.active);
        } else {
            return items;            
        }
    }

    private modeIsQuiz : boolean = true;
}

