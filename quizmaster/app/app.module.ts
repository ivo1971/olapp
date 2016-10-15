import {NgModule}                from '@angular/core';
import {BrowserModule}           from '@angular/platform-browser';
import {AppComponent}            from './app.component';

import {WebsocketMessageService} from './services/websocket.message.service';

import {UsersComponent}          from "./components/users/users.component";
import {StatusBarComponent}      from "./components/status-bar/status-bar.component";

@NgModule({
  imports:      [ 
    BrowserModule 
  ],
  declarations: [ 
    AppComponent, 
    UsersComponent,
    StatusBarComponent
  ],
  bootstrap:    [ 
    AppComponent 
  ],
  providers: [
    WebsocketMessageService,
  ],
})
export class AppModule {  
}