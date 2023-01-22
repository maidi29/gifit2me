import {Component, Input} from '@angular/core';
import {setNewRound, State} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-before-start-master',
  templateUrl: './before-start-master.component.html',
  styleUrls: ['./before-start-master.component.scss']
})
export class BeforeStartMasterComponent {
  @Input() roomId?: string;

  constructor(private store: Store<State>, private socketService: SocketService) {}

  public startNewRound() {
    this.store.dispatch(setNewRound({nRound: {}}));
    this.socketService.setRound({})
  }

}
