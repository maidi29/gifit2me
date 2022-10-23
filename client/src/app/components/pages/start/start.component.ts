import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {addPlayer, selectPlayers, State} from "../../../reducers";
import {Player} from "../../../model/player.model";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  private roomId?: number;

  constructor(private socketService: SocketService, private router: Router, private store: Store<State>) { }

  ngOnInit(): void {
  }

  public startGame (newGame: boolean): void {
    const player: Player = {
      name: "dummy",
      score: 0,
      avatar: "tbd",
      isMaster: true
    }
    if (newGame) {
      this.socketService.createRoom(player);

    }
    this.socketService.onCreateRoom().subscribe((roomId: number) => {
      // Todo: error handling
      this.store.dispatch(addPlayer({nPlayer: player}));

      this.roomId = roomId;
      this.router.navigate(['/game']);
    })
  }

}
