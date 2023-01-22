import { Component, OnInit } from '@angular/core';
import {generateRandom} from "../../../util/helpers";
import {SITUATIONS} from "../../../constants/situations";
import {Store} from "@ngrx/store";
import {setSituation, State} from "../../../reducers/reducers";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-set-situation',
  templateUrl: './set-situation.component.html',
  styleUrls: ['./set-situation.component.scss']
})
export class SetSituationComponent implements OnInit {
  public situationInput: string = "";
  public exampleSituations: string[] = [''];

  constructor(private store: Store<State>, private socketService: SocketService) {}

  ngOnInit(): void {
    this.exampleSituations = this.getNewRandomSituations();
  }

  public getNewRandomSituations(): string[] {
    const s1 = generateRandom(SITUATIONS.length-1, []);
    const s2 = generateRandom( SITUATIONS.length-1, [s1]);
    const s3 = generateRandom( SITUATIONS.length-1, [s1, s2]);
    return [SITUATIONS[s1],SITUATIONS[s2],SITUATIONS[s3]];
  }

  public setSituation(situation: string) {
    this.store.dispatch(setSituation({situation}));
    this.socketService.setSituation(situation);
  }

}
