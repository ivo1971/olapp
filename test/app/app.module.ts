import {BrowserModule}  from '@angular/platform-browser';
import {FormsModule}    from '@angular/forms';
import {NgModule}       from '@angular/core';
import {RouterModule}   from '@angular/router';

import {AppComponent}   from "./app.component";
import {EchoComponent}  from "./routes/echo/echo.component";
import {LoginComponent} from "./routes/login/login.component";

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'echo',
        component: EchoComponent
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
    ])
  ],
  declarations: [ 
    AppComponent,
    EchoComponent,
    LoginComponent 
  ],
  providers: [
  ],
  bootstrap:    [ 
    AppComponent 
  ]
})
export class AppModule { 
}
