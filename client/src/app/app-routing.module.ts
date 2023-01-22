import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from "./components/pages/start/start.component";
import { GameComponent } from "./components/pages/game/game.component";
import { ResultsComponent } from "./components/pages/results/results.component";
import { PrivacyComponent } from "./components/pages/privacy/privacy.component";

export enum ROUTES {
  START = '',
  GAME = 'game',
  RESULTS = 'results',
  PRIVACY = 'privacy',
}

const routes: Routes = [
  { path: ROUTES.START, component: StartComponent },
  { path: ROUTES.GAME, component: GameComponent },
  { path: ROUTES.RESULTS, component: ResultsComponent },
  { path: ROUTES.PRIVACY, component: PrivacyComponent },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
