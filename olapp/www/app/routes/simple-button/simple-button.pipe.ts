import {Pipe, PipeTransform}            from '@angular/core';

import {ModeService, EMode}    from './../../services/mode.service';

import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';
import {TeamInfo}             from './../../classes/team-info.class';

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

@Pipe({
    name: 'simpleButtonTeamPointsSort',
    pure: false
})
export class SimpleButtonTeamPointsSort implements PipeTransform {
    /* Construction
     */
    public constructor(
      ) {
    }

    /* Transform
     */
    transform(items: Array<TeamInfo>, sortOnTotal: boolean = true): Array<TeamInfo> {
        if(!items) return [];
        if(sortOnTotal) {
            return items.sort((team1, team2) => {
                if(team1.pointsTotal < team2.pointsTotal) {
                    return 1;
                }
                if(team1.pointsTotal > team2.pointsTotal) {
                    return -1;
                }
                if(team1.name < team2.name) {
                    return 1;
                }
                if(team1.name > team2.name) {
                    return -1;
                }
                return 0;
            })
        } else {
            return items.sort((team1, team2) => {
                if(team1.pointsRound < team2.pointsRound) {
                    return 1;
                }
                if(team1.pointsRound > team2.pointsRound) {
                    return -1;
                }
                if(team1.name < team2.name) {
                    return 1;
                }
                if(team1.name > team2.name) {
                    return -1;
                }
                return 0;
            })
        }
    }

    private modeIsQuiz : boolean = true;
}

@Pipe({
    name: 'simpleButtonTeamAlphabeticSort',
    pure: false
})
export class SimpleButtonTeamAlphabeticSort implements PipeTransform {
    /* Construction
     */
    public constructor(
      ) {
    }

    /* Transform
     */
    transform(items: Array<TeamInfo>): Array<TeamInfo> {
        if(!items) return [];
        return items.sort((team1, team2) => {
            if(team1.name === team2.name) {
                return 0;
            }
            return team1.name < team2.name ? 1 : -1;
        })
    }

    private modeIsQuiz : boolean = true;
}
