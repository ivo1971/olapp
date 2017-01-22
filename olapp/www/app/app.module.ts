//Built-in modules
import {BrowserModule}                 from '@angular/platform-browser';
import {CanActivate}                   from '@angular/router';
import {CanDeactivate}                 from '@angular/router';
import {FormsModule}                   from '@angular/forms';
import {HttpModule}                    from "@angular/http";
import {NgModule}                      from '@angular/core';
import {RouterModule}                  from '@angular/router';

//Own services
import {CloudService}                  from './services/cloud.service';
import {LogService}                    from './services/log.service';
import {ModeService}                   from './services/mode.service';
import {TeamsUsersService}             from './services/teams-users.service';
import {UserService}                   from './services/user.service';
import {WebsocketUserService}          from './services/websocket.user.service';

//Own providers: guards
import {UsernameSetGuard}              from './providers/guards/username-set.guard';

//Own components: application
import {AppComponent}                  from "./app.component";

//Own components: routes
import {AboutComponent}                from "./routes/about/about.component";
import {ConfigurationComponent}        from "./routes/configuration/configuration.component";
import {ConfigureTeamsMasterComponent} from "./routes/configure-teams-master/configure-teams-master.component";
import {LoginComponent}                from "./routes/login/login.component";
import {SimpleButtonComponent}         from "./routes/simple-button/simple-button.component";
import {SimpleButtonComponentData}     from "./routes/simple-button/simple-button-data.component";
import {SimpleButtonMasterComponent}   from "./routes/simple-button/simple-button-master.component";
import {TestComponent}                 from "./routes/test/test.component";
import {WelcomeComponent}              from "./routes/welcome/welcome.component";

//Own components: components
import {ImageLocalComponent}           from "./components/image-local/image-local.component";
import {ImageNativeComponent}          from "./components/image-native/image-native.component";
import {MenuComponent}                 from "./components/menu/menu.component";
import {StatusBarComponent}            from "./components/status-bar/status-bar.component";
import {TeamInfoComponent}             from "./components/team-info/team-info.component";
import {TeamInfoListComponent}         from "./components/team-info-list/team-info-list.component";
import {UserInfoComponent}             from "./components/user-info/user-info.component";
import {UserInfoListComponent}         from "./components/user-info-list/user-info-list.component";

//Own components: pipes
import {SimpleButtonActiveFilter}      from "./routes/simple-button/simple-button.pipe";

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
            path: 'configure-teams',
            component: ModeService.SIsMaster() ? ConfigureTeamsMasterComponent : WelcomeComponent
          },
          {
            path: 'simple-button',
            component: ModeService.SIsMaster() ? SimpleButtonMasterComponent : SimpleButtonComponent
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
    //services
    CloudService,
    LogService,
    ModeService,
    TeamsUsersService,
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
    ConfigureTeamsMasterComponent,
    LoginComponent,
    SimpleButtonComponent,
    SimpleButtonComponentData,
    SimpleButtonMasterComponent,
    TestComponent,
    WelcomeComponent,
    //components
    ImageLocalComponent,
    ImageNativeComponent,
    MenuComponent,
    StatusBarComponent,
    TeamInfoComponent,
    TeamInfoListComponent,
    UserInfoComponent,
    UserInfoListComponent,
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
