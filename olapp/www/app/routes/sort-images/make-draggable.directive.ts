/*
 * Source: https://medium.com/@mithun_daa/drag-and-drop-in-angular-2-using-native-html5-api-f628ce4edc3b#.f9thtvlmk
 * 
 */
import {Directive}            from '@angular/core';
import {ElementRef}           from '@angular/core';
import {EventEmitter}         from '@angular/core';
import {Input}                from '@angular/core';
import {OnInit}               from '@angular/core';

@Directive({
  selector: '[make-draggable]'
})
export class MakeDraggable {
  @Input("make-draggable") data: string = "default data";
  
  constructor(private elementRef: ElementRef) {
  }
  
  ngOnInit() {
    // Get the current element
    //let el = this.elementRef.nativeElement.querySelector('li');
    let el = this.elementRef.nativeElement;
    
    // Set the draggable attribute to the element
    el.draggable = 'true';
    
    // Set up the dragstart event and add the drag-src CSS class 
    // to change the visual appearance. Set the current todo as the data
    // payload by stringifying the object first
    el.addEventListener('dragstart', (e) => {
      el.classList.add('drag-src')
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', JSON.stringify(this.data));
      return false;
    });
    
    // Remove the drag-src class
    el.addEventListener('dragend', (e) => {
      e.preventDefault();
      el.classList.remove('drag-src')
      return false;
    });
  }
}