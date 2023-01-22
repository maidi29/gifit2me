import {Component, Input, OnInit} from '@angular/core';
import {Round} from "../../../model/round.model";
import {Store} from "@ngrx/store";
import {State} from "../../../reducers/reducers";
import {Player} from "../../../model/player.model";

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent {
  @Input() activeRound?: Round;
  @Input() players?: Player[];
  @Input() numberRounds?: number;

  constructor() {}

  public hasAnswered(name: string): boolean {
    return ((this.activeRound?.answers?.find(({playerName})=> playerName === name)) !== undefined) &&
      (!this.activeRound.flippedAnswers || this.activeRound.flippedAnswers?.size === 0);
  }

}
