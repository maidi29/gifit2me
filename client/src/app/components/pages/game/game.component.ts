import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {addPlayers, selectPlayers, setNewRound, setRoom, State} from "../../../reducers";
import {Observable} from "rxjs";
import {Player} from "../../../model/player.model";
import {Router} from "@angular/router";
import {SITUATIONS} from "../../../constants/situations";
import {SocketService} from "../../../services/socket.service";
import {Round} from "../../../model/round.model";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public players$?: Observable<Player[]>;
  public roomId$?: Observable<string | undefined>;
  public activeRound$?: Observable<Round>;
  public ownPlayer?: Player;
  public exampleSituations = SITUATIONS.slice(0,3);

  constructor(private store: Store<State>, private router: Router, private socketService: SocketService) {
    this.players$ = store.select("players");
    this.roomId$ = store.select("room");
    this.activeRound$ = store.select("activeRound");
  }

  ngOnInit(): void {
    this.players$?.subscribe((players) =>
      this.ownPlayer = players.find(({isSelf}) => !!isSelf)
    );
    this.roomId$?.subscribe((roomId) => {
      if(!roomId) {
        this.router.navigate(['']);
      }
    });
    this.socketService.onSetRound().subscribe((nRound)=> this.store.dispatch(setNewRound({nRound})));
    this.socketService.onPlayerJoin().subscribe((player)=> this.store.dispatch(addPlayers({nPlayer: [player]})));
  }

  public getNewRandomSituations(): void {
    this.exampleSituations = SITUATIONS.slice(0,3); // get random;
  }

  public startNewRound(situation: string) {
    const nRound = {
      situation,
      answers: []
    }
    this.store.dispatch(setNewRound({nRound}));
    this.socketService.setRound(nRound)
  }
}
