import {Component}             from '@angular/core';
import {EventEmitter}          from '@angular/core';
import {Input}                 from '@angular/core';
import {Output}                from '@angular/core';
import {Router}                from '@angular/router';

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

    public constructor(
        private router : Router
        ) {
    }
    
    public toggleMenu() : void {
        this.menuClosed = !this.menuClosed;
        this.menuClosedChange.emit(this.menuClosed);
    }

    public onClickChangeUserName() : void {
        this.router.navigate(['/login']);
        this.toggleMenu();
    }
}
