import {Component}            from '@angular/core';
import {Input}                from '@angular/core';

import {TeamInfo}             from './../../classes/team-info.class';

@Component({
    moduleId   : module.id,
    selector   : 'team-info',
    styleUrls  : [
        'team-info.component.css'
    ],
    templateUrl: 'team-info.component.html'
})
export class TeamInfoComponent  { 
    @Input() team   : TeamInfo;
}
