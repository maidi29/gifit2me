import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartComponent} from "./components/pages/start/start.component";
import {GameComponent} from "./components/pages/game/game.component";
import {ResultsComponent} from "./components/pages/results/results.component";
import {PrivacyComponent} from "./components/pages/privacy/privacy.component";

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: "game", component: GameComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'privacy', component: PrivacyComponent },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
