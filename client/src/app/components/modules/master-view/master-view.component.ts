import { Component, OnInit } from '@angular/core';
import {SITUATIONS} from "../../../constants/situations";
import {flipAnswer, setSituation, State} from "../../../reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Answer, Round} from "../../../model/round.model";

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnInit {
  public exampleSituations = SITUATIONS.slice(0,3);
  public activeRound?: Round;
  public situationInput: string = "";
  public roundAnswers?: Answer[];

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("activeRound").subscribe((activeRound) => {
      this.activeRound = activeRound;
      this.roundAnswers = activeRound?.answers;
      /*if(activeRound?.answers) {
        const elementsToAdd = activeRound.answers.filter((x) => !this.roundAnswers.find(y => y.playerName === x.playerName) );
        console.log(elementsToAdd);
        if(elementsToAdd) {
          this.roundAnswers = [...this.roundAnswers, ...elementsToAdd];
        }
        activeRound.answers.forEach((answer) => {
          const index = this.roundAnswers.findIndex(({playerName})=> playerName === answer.playerName);
          if(index !== -1)
          this.roundAnswers[index].flipped = answer.flipped;
        })
      }*/
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
    this.store.dispatch(flipAnswer({playerName}));
    this.socketService.flipAnswer(playerName);
  }

}
