import {Component}               from '@angular/core';
import {Router}                  from '@angular/router';

@Component({
  moduleId   : module.id,
  selector   : 'mode-selector',
  templateUrl: 'mode-selector.component.html'
})
export class ModeSelectorComponent {
    public constructor(
      private router           : Router
      ) {
    }

    public select(mode : string) {
        var modeArray = [mode];
        console.log("Select request to [" + mode + "]");
        this.router.navigate(modeArray);
    }
}