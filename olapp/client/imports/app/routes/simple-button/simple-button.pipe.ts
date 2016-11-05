import {Pipe, PipeTransform}            from '@angular/core';

import {SimpleButtonTeamInfo}           from './../../classes/simple-button-info.class';

@Pipe({
    name: 'simpleButtonActiveFilter',
    pure: false
})
export class SimpleButtonActiveFilter implements PipeTransform {
    transform(items: SimpleButtonTeamInfo[]): SimpleButtonTeamInfo[] {
        if(!items) return [];
        return items.filter(item => item.active);
    }
}

