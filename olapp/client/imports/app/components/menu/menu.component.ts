import {Component}             from '@angular/core';
import {EventEmitter}          from '@angular/core';
import {Input}                 from '@angular/core';
import {Output}                from '@angular/core';
import {Router}                from '@angular/router';

import template                from "./menu.component.html";
import style                   from "./menu.component.scss";

@Component({
  selector: "menu",
  template,
  styles: [ style ]
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

    public onClickAbout() : void {
        this.router.navigate(['/configuration/about']);
        this.toggleMenu();
    }    

    public onClickConfigure() : void {
        this.router.navigate(['/configuration/configure']);
        this.toggleMenu();
    }    
}
