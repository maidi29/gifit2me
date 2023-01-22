import {Component, Input} from '@angular/core';
import {setNewRound, setNumberRounds, State} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Player} from "../../../model/player.model";

@Component({
  selector: 'app-before-start-master',
  templateUrl: './before-start-master.component.html',
  styleUrls: ['./before-start-master.component.scss']
})
export class BeforeStartMasterComponent {
  @Input() roomId?: string;

  public numberRuns = 3;
  public players?: Player[];

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("players").subscribe((players) => {
      this.players = players;
    });
  }

  public startNewRound() {
    this.store.dispatch(setNewRound({nRound: {}}));
    this.socketService.setRound({});
    if(this.players && this.numberRuns) {
      const number = this.numberRuns * this.players.length;
      this.store.dispatch(setNumberRounds({number}));
      this.socketService.setNumberRounds(number);
    }
  }

}
