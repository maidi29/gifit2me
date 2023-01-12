import { Component, OnInit } from '@angular/core';
import {SITUATIONS} from "../../../constants/situations";
import {changeScore, flipAnswer, setNewRound, setSituation, State, updateMaster, updateWinner} from "../../../reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Answer, Round} from "../../../model/round.model";
import {Observable} from "rxjs";
import {Player} from "../../../model/player.model";

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnInit {
  public exampleSituations = SITUATIONS.slice(0,3);
  public activeRound?: Round;
  public situationInput: string = "";
  public selectedWinner?: string;
  public winner?: {winnerGifUrl: string, winnerName: string}
  public players?: Player[];

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("activeRound").subscribe((activeRound) => {
      this.activeRound = activeRound;
      if (activeRound?.winner) {
        this.winner = {
          winnerName: activeRound.winner,
          winnerGifUrl: activeRound.answers?.find(({playerName}) => playerName === activeRound.winner)?.gifUrl ?? ''
        }
        console.log(activeRound.winner);
        console.log(this.winner);

      }
    });
    store.select("players").subscribe((players) => {
      this.players = players;
    });
  }

  ngOnInit(): void {
  }

  public getNewRandomSituations(): void {
    this.exampleSituations = SITUATIONS.slice(0,3); // get random;
  }

  public setSituation(situation: string) {
    this.store.dispatch(setSituation({situation}));
    this.socketService.setSituation(situation);
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
