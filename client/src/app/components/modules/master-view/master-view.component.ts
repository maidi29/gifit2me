import { Component } from '@angular/core';
import {changeScore, flipAnswer, setNewRound, State, updateMaster, updateWinner} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Round} from "../../../model/round.model";
import {Player} from "../../../model/player.model";

enum ViewState { setSituation, waitForPlayers, answersReveal, winnerDisplay}

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent {
  public ViewState = ViewState;
  public activeRound?: Round;
  public selectedWinner?: string;
  public winner?: {winnerGifUrl: string, winnerName: string}
  public players?: Player[];
  public state: ViewState = ViewState.setSituation;

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("players").subscribe((players) => {
      this.players = players;
    });
    store.select("activeRound").subscribe((activeRound) => {
      this.activeRound = activeRound;
      if(activeRound?.situation) {
        this.state = ViewState.waitForPlayers;
      }
      if(activeRound?.answers && this.players && activeRound.answers.length >= this.players.length-1) {
        this.state = ViewState.answersReveal;
      }
      if (activeRound?.winner) {
        this.winner = {
          winnerName: activeRound.winner,
          winnerGifUrl: activeRound.answers?.find(({playerName}) => playerName === activeRound.winner)?.gifUrl ?? ''
        };
        this.state = ViewState.winnerDisplay;
      }
    });
  }

  public flipCard(playerName: string) {
    if(this.activeRound?.flippedAnswers?.has(playerName)) {
      this.selectedWinner = playerName;
    } else {
      this.store.dispatch(flipAnswer({playerName}));
      this.socketService.flipAnswer(playerName);
    }
  }

  public setWinner(playerName: string) {
    this.store.dispatch(updateWinner({name: playerName}));
    this.store.dispatch(changeScore({name: playerName, value: 1}));
    this.socketService.chooseWinner(playerName);
  }

  public passToNextMaster() {
    this.store.dispatch(setNewRound({nRound: {}}));
    this.socketService.setRound({});
    if(this.players) {
      const myIndex = this.players.findIndex((player) => player.isMaster);
      const newMaster = this.players[(myIndex+1) % this.players.length];
      this.store.dispatch(updateMaster({name:newMaster.name}));
      this.socketService.updateMaster(newMaster.name);
    }

  }

}
