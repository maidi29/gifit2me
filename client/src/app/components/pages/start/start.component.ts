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
  private player?: Player;
  private gameId: string | null = null;
  private avatar?: string;

  public startForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    gameId: new FormControl('', [Validators.minLength(3)]),
  });

  constructor(private socketService: SocketService, private router: Router, private store: Store<State>) {
  }

  ngOnInit(): void {
    this.startForm.controls.name.registerOnChange(() => {
      this.startForm.controls.name.setErrors({'alreadyTaken': false})
    });
    this.startForm.controls.gameId.registerOnChange(() => {
      this.startForm.controls.gameId.setErrors({'notFound': false});
    });


    this.socketService.onJoinRoom().subscribe((players: Player[]) => {
      if (this.player && this.gameId) {
        this.store.dispatch(addPlayers({nPlayer: [...players, {...this.player, isSelf: true}]}));
        this.store.dispatch(setRoom({room: this.gameId}));
        this.router.navigate(['/game']);
      }
    });
    this.socketService.onJoinRoomError().subscribe((error) => {
      this.startForm.get(error.controlName)?.setErrors({[error.error]: true})
    });
    this.socketService.onCreateRoom().subscribe((roomId: string) => {
      if (this.player) {
        this.store.dispatch(addPlayers({nPlayer: [{...this.player, isSelf: true}]}));
        this.store.dispatch(setRoom({room: roomId}));
        this.router.navigate(['/game']);
      }
    });
  }

  public startGame(newGame: boolean): void {
    console.log(this.startForm.controls.gameId.errors);
    newGame ? this.startForm.controls.gameId.removeValidators(Validators.required) : this.startForm.controls.gameId.addValidators(Validators.required);
    this.startForm.markAllAsTouched();
    this.startForm.controls.gameId.updateValueAndValidity();

    const username = this.startForm.controls.name.value;
    const gameId = this.startForm.controls.gameId.value;

    if (this.startForm.valid && username) {
      this.player = {
        name: username,
        score: 0,
        avatar: this.avatar,
        isMaster: newGame,
      };
      this.gameId = gameId;
      newGame ? this.socketService.createRoom(this.player) : this.socketService.joinRoom(this.player, this.gameId!);
      ;
    }
  }

  public setAvatar(event: string) {
    this.avatar = event;
  }
}
