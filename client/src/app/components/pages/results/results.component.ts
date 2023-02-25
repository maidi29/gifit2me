import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {removePlayer, softReset, State} from "../../../reducers/reducers";
import {Player} from "../../../model/player.model";
import {ROUTES} from "../../../app-routing.module";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  public players?: Player[];
  private sub: Subscription = new Subscription;

  constructor(private store: Store<State>, private router: Router, private socketService: SocketService) {
    store.select("players").subscribe((players) => {
      this.players = [...players].sort((a,b) => b.score - a.score);
    });
  }

  ngOnInit(): void {
    if(!this.players || this.players.length === 0) {
      this.router.navigate([ROUTES.START])
    }
    this.sub = this.socketService.onPlayerLeft().subscribe((name) => this.store.dispatch(removePlayer({name})));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public newGame(): void {
    this.store.dispatch(softReset());
    this.router.navigate([ROUTES.GAME]);
  }

}
