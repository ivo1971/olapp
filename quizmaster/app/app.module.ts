import {NgModule}                from '@angular/core';
import {BrowserModule}           from '@angular/platform-browser';
import {AppComponent}            from './app.component';

import {WebsocketMessageService} from './services/websocket.message.service';

import {UsersComponent}          from "./components/users/users.component";

@NgModule({
  imports:      [ 
    BrowserModule 
  ],
  declarations: [ 
    AppComponent, 
    UsersComponent
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