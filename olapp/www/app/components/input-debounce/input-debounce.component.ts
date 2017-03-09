import {Component}            from '@angular/core';
import {EventEmitter}         from '@angular/core';
import {ElementRef}           from '@angular/core';
import {Input}                from '@angular/core';
import {Output}               from '@angular/core';
import {Observable}           from 'rxjs/Rx';
import {Subscription}         from 'rxjs/Subscription';

@Component({
    selector: 'input-debounce',
    template: '<input type="text" class="form-control" [disabled]="disabled" [(ngModel)]="value">'
})
export class InputDebounceComponent {  
    @Input()  delay:       number               = 500;
    @Input()  disabled:    boolean              = false;
    @Input()  value:       string               = "";
    @Output() valueEv:     EventEmitter<string> = new EventEmitter<string>();

    constructor(private elementRef: ElementRef) {
        const eventStream = Observable.fromEvent(elementRef.nativeElement, 'keyup')
            .map(() => this.value)
            .debounceTime(this.delay)
            .distinctUntilChanged();
        this.eventStreamSubscription = eventStream.subscribe(
            input => {
                this.valueEv.emit(input);
            }
        );
    }

    destructor() {
        this.eventStreamSubscription.unsubscribe();
    }

    private eventStreamSubscription : Subscription;
}
