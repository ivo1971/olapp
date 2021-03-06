import {Component}            from '@angular/core';
import {Input}                from '@angular/core';

import {SimpleButtonInfo}     from './../../classes/simple-button-info.class';
import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button-data',
    styleUrls  : [
        'simple-button-data.component.css'
    ],
    templateUrl: 'simple-button-data.component.html'
})
export class SimpleButtonComponentData  { 
    @Input() data   : SimpleButtonTeamInfo ;
}
