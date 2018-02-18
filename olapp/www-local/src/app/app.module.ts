// built-in modules
import {BrowserModule} from '@angular/platform-browser';
import {CanActivate} from '@angular/router';
import {CanDeactivate} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// own services
import {CloudService} from './services/cloud.service';
import {ImgBase64Service} from './services/img-base64.service';
import {LogService} from './services/log.service';
import {ModeService} from './services/mode.service';
import {TeamfieService} from './services/teamfie.service';
import {TeamsUsersService} from './services/teams-users.service';
import {UserService} from './services/user.service';
import {WebsocketUserService} from './services/websocket.user.service';

// own providers: guards
import {UsernameSetGuard} from './providers/guards/username-set.guard';

// own components: application
import {AppComponent} from './app.component';

// own components: routes
import {AboutComponent} from './routes/about/about.component';
import {ConfigurationComponent} from './routes/configuration/configuration.component';
import {ConfigureTeamsMasterComponent} from './routes/configure-teams-master/configure-teams-master.component';
import {ConfigureTeamsWrapperComponent} from './routes/configure-teams-master/configure-teams-wrapper.component';
import {LoginComponent} from './routes/login/login.component';
import {QuestionsComponent} from './routes/questions/questions.component';
import {QuestionsBeamerComponent} from './routes/questions/questions-beamer.component';
import {QuestionsImagesComponent} from './routes/questions/questions-images.component'
import {QuestionsMasterComponent} from './routes/questions/questions-master.component';
import {QuestionsWrapperComponent} from './routes/questions/questions-wrapper.component';
import {ScoreboardComponent} from './routes/scoreboard/scoreboard.component';
import {ScoreboardMasterComponent} from './routes/scoreboard-master/scoreboard-master.component';
import {ScoreboardWrapperComponent} from './routes/scoreboard-master/scoreboard-wrapper.component';
import {SimpleButtonComponent} from './routes/simple-button/simple-button.component';
import {SimpleButtonComponentData} from './routes/simple-button/simple-button-data.component';
import {SimpleButtonMasterComponent} from './routes/simple-button/simple-button-master.component';
import {SimpleButtonWrapperComponent} from './routes/simple-button/simple-button-wrapper.component';
import {SortImagesComponent} from './routes/sort-images/sort-images.component';
import {SortImagesBeamerComponent} from './routes/sort-images/sort-images-beamer.component';
import {SortImagesMasterComponent} from './routes/sort-images/sort-images-master.component';
import {SortImagesWrapperComponent} from './routes/sort-images/sort-images-wrapper.component';
import {TeamfieComponent} from './routes/teamfie/teamfie.component';
import {TestComponent} from './routes/test/test.component';
import {WelcomeComponent} from './routes/welcome/welcome.component';

// own components: components
import {ImageLocalComponent} from './components/image-local/image-local.component';
import {ImageNativeComponent} from './components/image-native/image-native.component';
import {ImageTeamfieComponent} from './components/image-teamfie/image-teamfie.component';
import {InputDebounceComponent} from './components/input-debounce/input-debounce.component';
import {MenuComponent} from './components/menu/menu.component';
import {ScoreboardListComponent} from './components/scoreboard-list/scoreboard-list.component';
import {StatusBarComponent} from './components/status-bar/status-bar.component';
import {TeamInfoComponent} from './components/team-info/team-info.component';
import {TeamInfoListComponent} from './components/team-info-list/team-info-list.component';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {UserInfoListComponent} from './components/user-info-list/user-info-list.component';

// own components: pipes
import {SimpleButtonActiveFilter} from './routes/simple-button/simple-button.pipe';
import {SimpleButtonTeamPointsSort} from './routes/simple-button/simple-button.pipe';
import {SimpleButtonTeamAlphabeticSort} from './routes/simple-button/simple-button.pipe';

// module definition
@NgModule({
  // inject built-in modules
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      // no need to be logged in before
      {
        path: 'login',
        component: LoginComponent,
        canDeactivate: [
            UsernameSetGuard
        ]
      },
      //  these routes require post-login
      //  (hence the canActivate-guard)
      {
        path: 'quiz',
        canActivate: [
            UsernameSetGuard
        ],
        children : [
          {
            path: 'configure-teams',
            component: ConfigureTeamsWrapperComponent,
          },
          {
            path: 'questions',
            component: QuestionsWrapperComponent,
          },
          {
            path: 'scoreboard',
            component: ScoreboardWrapperComponent
          },
          {
            path: 'simple-button',
            component: SimpleButtonWrapperComponent
          },
          {
            path: 'sort-images',
            component: SortImagesWrapperComponent,
          },
          {
            path: 'teamfie',
            component: TeamfieComponent,
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
  // inject your own services
  providers: [
    // services
    CloudService,
    ImgBase64Service,
    LogService,
    ModeService,
    TeamfieService,
    TeamsUsersService,
    UserService,
    WebsocketUserService,
    // guards
    UsernameSetGuard,
  ],
  // inject your own components
  declarations: [
    // application
    AppComponent,
    // routes
    AboutComponent,
    ConfigurationComponent,
    ConfigureTeamsMasterComponent,
    ConfigureTeamsWrapperComponent,
    LoginComponent,
    QuestionsComponent,
    QuestionsBeamerComponent,
    QuestionsMasterComponent,
    QuestionsWrapperComponent,
    ScoreboardComponent,
    ScoreboardMasterComponent,
    ScoreboardWrapperComponent,
    SimpleButtonComponent,
    SimpleButtonComponentData,
    SimpleButtonMasterComponent,
    SimpleButtonWrapperComponent,
    SortImagesComponent,
    SortImagesBeamerComponent,
    SortImagesMasterComponent,
    SortImagesWrapperComponent,
    TeamfieComponent,
    TestComponent,
    WelcomeComponent,
    // components
    ImageLocalComponent,
    ImageNativeComponent,
    ImageTeamfieComponent,
    InputDebounceComponent,
    MenuComponent,
    QuestionsImagesComponent,
    ScoreboardListComponent,
    StatusBarComponent,
    TeamInfoComponent,
    TeamInfoListComponent,
    UserInfoComponent,
    UserInfoListComponent,
    // filters
    SimpleButtonActiveFilter,
    SimpleButtonTeamPointsSort,
    SimpleButtonTeamAlphabeticSort,
  ],
  // module you need to bootstrap
  bootstrap:    [
    AppComponent
  ]
})
export class AppModule {
}
