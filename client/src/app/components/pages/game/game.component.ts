import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {
  addAnswerGif,
  addPlayers, changeScore, flipAnswer, removePlayer,
  setNewRound,
  setSituation,
  State, updateMaster, updateWinner
} from "../../../reducers/reducers";
import {Observable, Subscription} from "rxjs";
import {Player} from "../../../model/player.model";
import {Router} from "@angular/router";
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
  public activeRound?: Round;
  public ownPlayer?: Player;
  subscriptions: Subscription[] = [];
  public isTrue: boolean = false;

  constructor(private store: Store<State>, private router: Router, private socketService: SocketService) {
    this.players$ = store.select("players");
    this.roomId$ = store.select("room");
    store.select("activeRound").subscribe((activeRound) => {
      this.activeRound = activeRound;
    });
  }

  ngOnInit(): void {
    this.players$?.subscribe((players) =>
      this.ownPlayer = players.find(({isSelf}) => !!isSelf)
    );
    this.roomId$?.subscribe((roomId) => {
      if(!roomId) this.router.navigate(['']);
    });
    const sub3 = this.socketService.onSetRound().subscribe((nRound)=> this.store.dispatch(setNewRound({nRound})));
    const sub4 = this.socketService.onPlayerJoin().subscribe((player)=> this.store.dispatch(addPlayers({nPlayer: [player]})));
    const sub5 = this.socketService.onSendAnswerGif().subscribe((answer)=> this.store.dispatch(addAnswerGif({answer})));
    const sub6 = this.socketService.onSetSituation().subscribe((situation)=> this.store.dispatch(setSituation({situation})));
    const sub7 = this.socketService.onFlipAnswer().subscribe((playerName)=> this.store.dispatch(flipAnswer({playerName})));
    const sub8 = this.socketService.onChooseWinner().subscribe((name)=> {
      this.store.dispatch(updateWinner({name}))
      this.store.dispatch(changeScore({name, value: 1}));
    });
    const sub9 = this.socketService.onUpdateMaster().subscribe((name) => this.store.dispatch(updateMaster({name})));
    const sub10 = this.socketService.onPlayerLeft().subscribe((name) => this.store.dispatch(removePlayer({name})));
    this.subscriptions.push(sub3,sub4,sub5,sub6,sub7,sub8,sub9,sub10);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  public startNewRound() {
    this.store.dispatch(setNewRound({nRound: {}}));
    this.socketService.setRound({})
  }

  public hasAnswered(name: string): boolean {
    return ((this.activeRound?.answers?.find(({playerName})=> playerName === name)) !== undefined) &&
      (!this.activeRound.flippedAnswers || this.activeRound.flippedAnswers?.size === 0);
  }
}
