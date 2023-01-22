import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Player} from "../model/player.model";
import {Observable} from "rxjs";
import {Answer, Round} from "../model/round.model";
import {SOCKET_EVENTS} from "../../../../shared/socketEvents";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {}

    createRoom(player: Player) {
      this.socket.emit(SOCKET_EVENTS.CREATE_ROOM, player)
    }

    onCreateRoom(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.CREATE_ROOM);
    }

    joinRoom(player: Player, roomId: string) {
      this.socket.emit(SOCKET_EVENTS.JOIN_ROOM, {player, roomId})
    }

    onJoinRoom(): Observable<{players: Player[], roomId: string}> {
      return this.socket.fromEvent(SOCKET_EVENTS.JOIN_ROOM);
    }

    onPlayerJoin(): Observable<Player> {
      return this.socket.fromEvent(SOCKET_EVENTS.PLAYER_JOIN);
    }

    setRound(round: Round) {
      this.socket.emit(SOCKET_EVENTS.SET_ROUND, {round});
    }

    onSetRound(): Observable<Round> {
      return this.socket.fromEvent(SOCKET_EVENTS.SET_ROUND);
    }

    setSituation(situation: string) {
      this.socket.emit(SOCKET_EVENTS.SET_SITUATION, {situation});
    }

    onSetSituation(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.SET_SITUATION);
    }

    onJoinRoomError(): Observable<{ error: string, controlName: string }> {
      return this.socket.fromEvent(SOCKET_EVENTS.JOIN_ROOM_ERROR);
    }

    sendAnswerGif(answer: Answer): void {
      this.socket.emit(SOCKET_EVENTS.SEND_ANSWER, answer);
    }

    onSendAnswerGif(): Observable<Answer> {
      return this.socket.fromEvent(SOCKET_EVENTS.SEND_ANSWER);
    }

    flipAnswer(name: string): void {
      this.socket.emit(SOCKET_EVENTS.FLIP_ANSWER, name);
    }

    onFlipAnswer(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.FLIP_ANSWER);
    }

    chooseWinner(name: string): void {
      this.socket.emit(SOCKET_EVENTS.CHOOSE_WINNER, name);
    }

    onChooseWinner(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.CHOOSE_WINNER);
    }

    updateMaster(name: string): void {
      this.socket.emit(SOCKET_EVENTS.UPDATE_MASTER, name);
    }

    onUpdateMaster(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.UPDATE_MASTER);
    }

    onPlayerLeft(): Observable<string> {
        return this.socket.fromEvent(SOCKET_EVENTS.PLAYER_LEFT);
    }
}
