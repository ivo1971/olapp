import {Component}            from '@angular/core';
import {Input}                from '@angular/core';

import {TeamInfo}             from './../../classes/team-info.class';

@Component({
    moduleId   : module.id,
    selector   : 'team-info-list',
    styleUrls  : [
        'team-info-list.component.css'
    ],
    templateUrl: 'team-info-list.component.html'
})
export class TeamInfoListComponent  { 
    @Input() data   : Array<TeamInfo> ;
}
