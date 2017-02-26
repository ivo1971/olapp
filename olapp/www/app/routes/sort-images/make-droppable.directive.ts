/*
 * Source: https://medium.com/@mithun_daa/drag-and-drop-in-angular-2-using-native-html5-api-f628ce4edc3b#.f9thtvlmk
 * 
 */
import {Directive}            from '@angular/core';
import {ElementRef}           from '@angular/core';
import {EventEmitter}         from '@angular/core';
import {OnInit}               from '@angular/core';
import {Output}               from '@angular/core';

@Directive({
  selector: '[make-droppable]'
})
export class MakeDroppable implements OnInit {
  @Output() dropped: EventEmitter<any> = new EventEmitter();
  
  constructor(private elementRef: ElementRef) {
  }
  
  ngOnInit() {
    let el = this.elementRef.nativeElement;

    // Add a style to indicate that this element is a drop target
    el.addEventListener('dragenter', (e) => {
      el.classList.add('drag-trg');
    });

    // Remove the style
    el.addEventListener('dragleave', (e) => {
      this.overClassSet = false;
      el.classList.remove('drag-trg');
    });

    el.addEventListener('dragover', (e) => {
      e.preventDefault();

      e.dataTransfer.dropEffect = 'move';

      if(!this.overClassSet) {
        this.overClassSet = true;
        el.classList.add('drag-trg');
      }

      return false;
    });

    // On drop, get the data and convert it back to a JSON object
    // and fire off an event passing the data
    el.addEventListener('drop', (e) => {
      e.preventDefault();  // Stops some browsers from redirecting.
      e.stopPropagation(); // Stops some browsers from redirecting.

      el.classList.remove('drag-trg');
      if(e.dataTransfer) {
        let text = e.dataTransfer.getData('text');
        if("text" !== typeof(text)) {
            let data = JSON.parse(text);
            this.dropped.emit(data);
        }
      }
      return false;
    })
  }

  private overClassSet : boolean = false;
}
