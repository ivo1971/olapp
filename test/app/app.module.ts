//Built-in modules
import {BrowserModule}         from '@angular/platform-browser';
import {FormsModule}           from '@angular/forms';
import {NgModule}              from '@angular/core';
import {RouterModule}          from '@angular/router';

//Own services
import {UserService}           from './services/user.service';
import {WebsocketUserService}  from './services/websocket.user.service';

//Own components: application
import {AppComponent}          from "./app.component";

//Own components: routes
import {EchoComponent}         from "./routes/echo/echo.component";
import {SimpleButtonComponent} from "./routes/simple-button/simple-button.component";
import {WelcomeComponent}      from "./routes/welcome/welcome.component";

//Own components: components
import {LoginComponent}        from "./components/login/login.component";
import {MenuComponent}         from "./components/menu/menu.component";
import {StatusBarComponent}    from "./components/status-bar/status-bar.component";

//Module definition
@NgModule({
  //Inject built-in modules
  imports: [
    BrowserModule, 
    FormsModule,
    RouterModule.forRoot([
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
        component: WelcomeComponent
      },
      {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
      },
    ])
  ],
  //Inject your own services
  providers: [
    WebsocketUserService,
    UserService,
  ],
  //Inject your own components
  declarations: [ 
    //application
    AppComponent,
    //routes
    EchoComponent,
    SimpleButtonComponent,
    WelcomeComponent,
    //components
    LoginComponent,
    MenuComponent,
    StatusBarComponent
  ],
  //Module you need to bootstrap
  bootstrap:    [ 
    AppComponent 
  ]
})
export class AppModule { 
}
