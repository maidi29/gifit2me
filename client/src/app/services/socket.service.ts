import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Player} from "../model/player.model";
import {Observable} from "rxjs";
import {Round} from "../model/round.model";

enum SOCKET_EVENTS {
  CREATE_ROOM = 'createRoom',
  JOIN_ROOM = 'joinRoom',
  SET_ROUND = 'setRound',
  SEND_ANSWER = 'sendAnswer',
  CHOOSE_WINNER = 'chooseWinner',
  UPDATE_MASTER = 'updateMaster',
  PLAYER_JOIN = 'playerJoin',
  SET_SITUATION= 'setSituation'
}


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

    onJoinRoom(): Observable<Player[]> {
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
}
