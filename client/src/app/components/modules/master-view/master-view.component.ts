import { Component, OnInit } from '@angular/core';
import {SITUATIONS} from "../../../constants/situations";
import {setNewRound, setSituation, State} from "../../../reducers";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {SocketService} from "../../../services/socket.service";
import {Round} from "../../../model/round.model";

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnInit {
  public exampleSituations = SITUATIONS.slice(0,3);
  public activeRound?: Round;
  public situationInput: string = "";

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("activeRound").subscribe((activeRound) => {
      this.activeRound = activeRound;
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

}
