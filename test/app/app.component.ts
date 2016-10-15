import {Component }        from '@angular/core';
import {Observable}        from 'rxjs/Observable';

@Component({
  moduleId   : module.id,
  selector   : 'test-app',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  private title : string = "OLApp test"; 
}
