import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {selectPlayers, State} from "../../../reducers";
import {Observable} from "rxjs";
import {Player} from "../../../model/player.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public players$?: Observable<Player[]>;
  public roomId$?: Observable<string | undefined>;
  public ownPlayer?: Player;

  constructor(private store: Store<State>, private router: Router) {
    this.players$ = store.select("players");
    this.roomId$ = store.select("room");
  }

  ngOnInit(): void {
    this.players$?.subscribe((players) =>
      this.ownPlayer = players.find(({isSelf}) => !!isSelf)
    )
  }

}
