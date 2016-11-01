//Built-in modules
import {BrowserModule}             from '@angular/platform-browser';
import {CanActivate}               from '@angular/router';
import {CanDeactivate}             from '@angular/router';
import {FormsModule}               from '@angular/forms';
import {HttpModule}                from "@angular/http";
import {NgModule}                  from '@angular/core';
import {RouterModule}              from '@angular/router';

//Own services
import {CloudService}              from './services/cloud.service';
import {LogService}                from './services/log.service';
import {UserService}               from './services/user.service';
import {WebsocketUserService}      from './services/websocket.user.service';

//Own providers: guards
import {UsernameSetGuard}          from './providers/guards/username-set.guard';

//Own components: application
import {AppComponent}              from "./app.component";

//Own components: routes
import {EchoComponent}             from "./routes/echo/echo.component";
import {LoginComponent}            from "./routes/login/login.component";
import {SimpleButtonComponent}     from "./routes/simple-button/simple-button.component";
import {SimpleButtonComponentData} from "./routes/simple-button/simple-button-data.component";
import {WelcomeComponent}          from "./routes/welcome/welcome.component";

//Own components: components
import {MenuComponent}             from "./components/menu/menu.component";
import {StatusBarComponent}        from "./components/status-bar/status-bar.component";

//Own components: pipes
import {SimpleButtonActiveFilter}  from "./routes/simple-button/simple-button.pipe";

//Module definition
@NgModule({
  //Inject built-in modules
  imports: [
    BrowserModule, 
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      //no need to be logged in before
      {
        path: 'login',
        component: LoginComponent,
        canDeactivate: [
            UsernameSetGuard  
        ]
      },
      //these routes require pre-login
      //(hence the canActivate-guard)
      {
        path: 'quiz',
        canActivate: [
            UsernameSetGuard  
        ],
        children : [
          {
            path: 'echo',
            component: EchoComponent
          },
          {
            path: 'simple-button',
            component: SimpleButtonComponent
          },
          {
            path: 'welcome',
            component: WelcomeComponent,
          },
        ]
      },
      {
        path: '',
        redirectTo: '/quiz/welcome',
        pathMatch: 'full'
      },
    ])
  ],
  //Inject your own services
  providers: [
    //services
    CloudService,
    LogService,
    UserService,
    WebsocketUserService,
    //guards
    UsernameSetGuard,
  ],
  //Inject your own components
  declarations: [ 
    //application
    AppComponent,
    //routes
    EchoComponent,
    SimpleButtonComponent,
    SimpleButtonComponentData,
    WelcomeComponent,
    //components
    LoginComponent,
    MenuComponent,
    StatusBarComponent,
    //filters
    SimpleButtonActiveFilter
  ],
  //Module you need to bootstrap
  bootstrap:    [ 
    AppComponent 
  ]
})
export class AppModule { 
}
