import {Component}             from '@angular/core';
import {EventEmitter}          from '@angular/core';
import {Input}                 from '@angular/core';
import {Output}                from '@angular/core';

@Component({
  moduleId   : module.id,
  selector   : 'menu',
  styleUrls  : [
      'menu.component.css',
  ],
  templateUrl: 'menu.component.html'
})
export class MenuComponent { 
    @Input()  menuClosed      : boolean;
    @Output() menuClosedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
    public toggleMenu() : void {
        this.menuClosed = !this.menuClosed;
        this.menuClosedChange.emit(this.menuClosed);
    }
}
