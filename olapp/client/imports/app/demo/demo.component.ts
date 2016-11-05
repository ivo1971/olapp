import { Component } from "@angular/core";
import template from "./demo.component.html";
import style from "./demo.component.scss";

@Component({
  selector: "demo",
  template,
  styles: [ style ]
})
export class DemoComponent {
  greeting: string;

  constructor() {
    this.greeting = "Hello Demo Component!";
  }
}
