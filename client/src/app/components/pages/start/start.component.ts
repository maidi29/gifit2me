import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {addPlayers, selectPlayers, setRoom, State} from "../../../reducers";
import {Player} from "../../../model/player.model";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  public name: string = "";
  public gameId: string = "";

  constructor(private socketService: SocketService, private router: Router, private store: Store<State>) { }

  ngOnInit(): void {
  }

  public startGame (newGame: boolean): void {
    const player: Player = {
      name: this.name,
      score: 0,
      avatar: "tbd",
      isMaster: newGame,
    }
    if (newGame) {
      this.socketService.createRoom(player);
      this.socketService.onCreateRoom().subscribe((roomId: string) => {
        // Todo: error handling
        this.store.dispatch(addPlayers({nPlayer: [{...player, isSelf: true}]}));
        this.store.dispatch(setRoom({room: roomId}));
        // Todo: use Routeguard
        this.router.navigate(['/game']);
      })
    } else {
      this.socketService.joinRoom(player, this.gameId);
      this.socketService.onJoinRoom().subscribe((players: Player[]) => {
        this.store.dispatch(addPlayers({nPlayer: [...players, {...player, isSelf: true}]}));
        this.store.dispatch(setRoom({room: this.gameId}));
        this.router.navigate(['/game']);
      })
    }
  }

}
