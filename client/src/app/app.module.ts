import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ButtonComponent } from './components/elements/button/button.component';
import { StartComponent } from './components/pages/start/start.component';
import { InputComponent } from './components/elements/input/input.component';
import { GameComponent } from './components/pages/game/game.component';
import { ResultsComponent } from './components/pages/results/results.component';
import { PrivacyComponent } from './components/pages/privacy/privacy.component';

const config: SocketIoConfig = {
  url: environment.socketUrl, // socket server url;
  options: {
    transports: ['websocket']
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    StartComponent,
    InputComponent,
    GameComponent,
    ResultsComponent,
    PrivacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
