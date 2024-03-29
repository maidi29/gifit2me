import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {
  addAnswerGif,
  addPlayers, changeScore, flipAnswer, removePlayer,
  setNewRound, setNumberRounds,
  setSituation,
  State, updateMaster, updateWinner
} from "../../../reducers/reducers";
import {Observable, Subscription} from "rxjs";
import {Player} from "../../../model/player.model";
import {Router} from "@angular/router";
import {SocketService} from "../../../services/socket.service";
import {Round} from "../../../model/round.model";
import {ROUTES} from "../../../app-routing.module";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public roomId?: string;
  public activeRound?: Round;
  public ownPlayer?: Player;
  public players?: Player[];
  public numberRounds?: number;

  private subscriptions: Subscription[] = [];

  constructor(private store: Store<State>,
              private router: Router,
              private socketService: SocketService) {
    store.select("numberRounds").subscribe((number) => {
      this.numberRounds = number;
    });
    store.select("players").subscribe((players) => {
      this.players = players;
      this.ownPlayer = players.find(({isSelf}) => !!isSelf)
    });
    store.select("activeRound").subscribe((activeRound) => {
      if(activeRound?.index && this.numberRounds && activeRound.index > this.numberRounds) {
        this.router.navigate([ROUTES.RESULTS]);
      }
      this.activeRound = activeRound;
    });
    store.select("room").subscribe((room) => {
      this.roomId = room;
    });
  }

  ngOnInit(): void {
    if(!this.roomId) this.router.navigate([ROUTES.START]);
    const sub1 = this.socketService.onSetRound().subscribe((nRound)=> this.store.dispatch(setNewRound({nRound})));
    const sub2 = this.socketService.onPlayerJoin().subscribe((player)=> this.store.dispatch(addPlayers({nPlayer: [player]})));
    const sub3 = this.socketService.onSendAnswerGif().subscribe((answer)=> this.store.dispatch(addAnswerGif({answer})));
    const sub4 = this.socketService.onSetSituation().subscribe((situation)=> this.store.dispatch(setSituation({situation})));
    const sub5 = this.socketService.onFlipAnswer().subscribe((playerName)=> this.store.dispatch(flipAnswer({playerName})));
    const sub6 = this.socketService.onChooseWinner().subscribe((name)=> {
      this.store.dispatch(updateWinner({name}))
      this.store.dispatch(changeScore({name, value: 1}));
    });
    const sub7 = this.socketService.onUpdateMaster().subscribe((name) => this.store.dispatch(updateMaster({name})));
    const sub8 = this.socketService.onPlayerLeft().subscribe((name) => this.store.dispatch(removePlayer({name})));
    const sub9 = this.socketService.onSetNumberRounds().subscribe((number) => this.store.dispatch(setNumberRounds({number})));
    this.subscriptions.push(sub1,sub2,sub3,sub4,sub5,sub6,sub7,sub8,sub9);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
