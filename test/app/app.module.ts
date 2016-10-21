import {BrowserModule}         from '@angular/platform-browser';
import {FormsModule}           from '@angular/forms';
import {NgModule}              from '@angular/core';
import {RouterModule}          from '@angular/router';

import {AppComponent}          from "./app.component";

import {UserService}           from './services/user.service';
import {WebsocketUserService}  from './services/websocket.user.service';

import {EchoComponent}         from "./routes/echo/echo.component";
import {WelcomeComponent}      from "./routes/welcome/welcome.component";

import {LoginComponent}        from "./components/login/login.component";
import {StatusBarComponent}    from "./components/status-bar/status-bar.component";

@NgModule({
  imports: [
    BrowserModule, 
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'echo',
        component: EchoComponent
      },
      {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
      },
    ])
  ],
  providers: [
    WebsocketUserService,
    UserService,
  ],
  declarations: [ 
    //application
    AppComponent,
    //routes
    EchoComponent,
    WelcomeComponent,
    //components
    LoginComponent,
    StatusBarComponent
  ],
  bootstrap:    [ 
    AppComponent 
  ]
})
export class AppModule { 
}
