import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {addPlayers, setRoom, State} from "../../../reducers";
import {Player} from "../../../model/player.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  public startForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    gameId: new FormControl('', [Validators.minLength(3)]),
  });

  constructor(private socketService: SocketService, private router: Router, private store: Store<State>) {
  }

  ngOnInit(): void {
  }

  public startGame(newGame: boolean): void {
    newGame ? this.startForm.controls.gameId.removeValidators(Validators.required) : this.startForm.controls.gameId.addValidators(Validators.required);
    this.startForm.markAllAsTouched();
    this.startForm.controls.gameId.updateValueAndValidity();

    const username = this.startForm.controls.name.value;
    const gameId = this.startForm.controls.gameId.value;

    if (this.startForm.valid && username) {
      const player: Player = {
        name: username,
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
          this.router.navigate(['/game']);
        })
      } else if(gameId) {
        this.socketService.joinRoom(player, gameId);
        this.socketService.onJoinRoom().subscribe((players: Player[]) => {
          this.store.dispatch(addPlayers({nPlayer: [...players, {...player, isSelf: true}]}));
          this.store.dispatch(setRoom({room: gameId}));
          this.router.navigate(['/game']);
        })
      }
    }

  }

}
