//Built-in modules
import {APP_BASE_HREF}             from '@angular/common';
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
import {AboutComponent}            from "./routes/about/about.component";
import {ConfigurationComponent}    from "./routes/configuration/configuration.component";
import {LoginComponent}            from "./routes/login/login.component";
import {SimpleButtonComponent}     from "./routes/simple-button/simple-button.component";
import {SimpleButtonComponentData} from "./routes/simple-button/simple-button-data.component";
import {TestComponent}             from "./routes/test/test.component";
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
      //these routes require post-login
      //(hence the canActivate-guard)
      {
        path: 'quiz',
        canActivate: [
            UsernameSetGuard  
        ],
        children : [
          {
            path: 'simple-button',
            component: SimpleButtonComponent
          },
          {
            path: 'test',
            component: TestComponent,
          },
          {
            path: 'welcome',
            component: WelcomeComponent,
          },
        ]
      },
      {
        path: 'configuration',
        canActivate: [
            UsernameSetGuard  
        ],
        children : [
          {
            path: 'about',
            component: AboutComponent
          },
          {
            path: 'configure',
            component: ConfigurationComponent
          },
        ]
      },
      {
        path: '',
        redirectTo: '/quiz/welcome',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: '/quiz/welcome',
        pathMatch: 'full'
      },
    ])
  ],
  //Inject your own services
  providers: [
    //base href for router to avoid it in the head,
    //which cordova does not like at all (file not found)
    {provide: APP_BASE_HREF, useValue : '/' },
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
    AboutComponent,
    ConfigurationComponent,
    SimpleButtonComponent,
    SimpleButtonComponentData,
    TestComponent,
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
