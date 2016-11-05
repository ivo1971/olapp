import {Component}            from '@angular/core';
import {Input}                from '@angular/core';

import {SimpleButtonInfo}     from './../../classes/simple-button-info.class';
import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';

import template                from "./simple-button-data.component.html";
import style                   from "./simple-button-data.component.scss";

@Component({
  selector: "simple-button-data",
  template,
  styles: [ style ]
})
export class SimpleButtonComponentData  { 
    @Input() data   : SimpleButtonTeamInfo ;
}
