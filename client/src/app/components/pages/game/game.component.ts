import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {selectPlayers, State} from "../../../reducers";
import {Observable} from "rxjs";
import {Player} from "../../../model/player.model";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public ownPlayer = {
    isMaster: false // TODO
  }
  public players$?: Observable<Player[]>;

  constructor(private store: Store<State>) {
    this.players$ = store.select("players");
  }

  ngOnInit(): void {
  }

}
