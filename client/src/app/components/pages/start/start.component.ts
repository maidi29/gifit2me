import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {addPlayers, setRoom, State} from "../../../reducers/reducers";
import {Player} from "../../../model/player.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ROUTES} from "../../../app-routing.module";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  private player?: Player;
  public avatar?: string;
  public showAvatarGenerator: boolean = false;

  public startForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    gameId: new FormControl('', [Validators.minLength(3)]),
  });

  constructor(private socketService: SocketService,
              private router: Router,
              private store: Store<State>,
              private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.startForm.controls.gameId.setValue(params['id']);
      }
    });
    this.listenToJoinError();
    this.resetAllErrorsOnChange();

    this.socketService.onJoinRoom().subscribe(({players, roomId}) => {
      this.dispatchStart(roomId, players)
    });
    this.socketService.onCreateRoom().subscribe((roomId: string) => {
      this.dispatchStart(roomId)
    });
  }

  public startGame(newGame: boolean): void {
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
      newGame ? this.socketService.createRoom(this.player) : this.socketService.joinRoom(this.player, gameId!);
    }
  }

  public updateAvatar(newAvatar: string) {
    this.avatar = newAvatar;
  }

  private dispatchStart(roomId: string, players: Player[] = []) {
    if (this.player) {
      this.store.dispatch(addPlayers({nPlayer: [...players, {...this.player, isSelf: true}]}));
      this.store.dispatch(setRoom({room: roomId}));
      this.router.navigate([ROUTES.GAME]);
    }
  }

  private resetAllErrorsOnChange() {
    this.startForm.controls.name.registerOnChange(() => {
      this.startForm.controls.name.setErrors({'alreadyTaken': false})
    });
    this.startForm.controls.gameId.registerOnChange(() => {
      this.startForm.controls.gameId.setErrors({'notFound': false});
      this.startForm.controls.gameId.setErrors({'started': false});
      this.startForm.controls.gameId.setErrors({'full': false});
    });
  }

  private listenToJoinError() {
    this.socketService.onJoinRoomError().subscribe((error) => {
      this.startForm.get(error.controlName)?.setErrors({[error.error]: true})
    });
  }
}
