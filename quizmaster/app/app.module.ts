import {NgModule}                from '@angular/core';
import {BrowserModule}           from '@angular/platform-browser';
import {RouterModule}            from '@angular/router';

import {AppComponent}            from './app.component';

import {WebsocketMessageService} from './services/websocket.message.service';

import {ModeSelectorComponent}   from "./components/mode-selector/mode-selector.component";
import {StatusBarComponent}      from "./components/status-bar/status-bar.component";
import {UsersComponent}          from "./components/users/users.component";

import {TestButtonComponent}     from "./routes/test-button/test-button.component";
import {WelcomeComponent}        from "./routes/welcome/welcome.component";

@NgModule({
  imports:      [ 
    BrowserModule, 
    RouterModule.forRoot([
      {
        path: 'test-button',
        component: TestButtonComponent
      },
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
      },
    ])
  ],
  declarations: [
    //application 
    AppComponent,
    //components 
    ModeSelectorComponent,
    UsersComponent,
    StatusBarComponent,
    //routes
    TestButtonComponent,
    WelcomeComponent
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