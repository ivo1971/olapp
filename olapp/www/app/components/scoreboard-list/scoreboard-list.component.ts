import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';
import {OnInit}                from '@angular/core';

import {TeamInfo}              from './../../classes/team-info.class';

@Component({
  moduleId   : module.id,
  selector   : 'scoreboard-list',
  styleUrls  : [
      'scoreboard-list.component.css',
  ],
  templateUrl: 'scoreboard-list.component.html'
})
export class ScoreboardListComponent implements OnInit { 
    @Input() nbrPerRow   : number          = 1;
    @Input() showDummy   : boolean         = false;
    @Input() total       : boolean         = true;
    @Input() teamsInfo   : Array<TeamInfo> = [];
    
    public constructor() {
    }

    public ngOnInit() : void {
    }
}
