import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Player} from "../model/player.model";
import {Observable} from "rxjs";

enum SOCKET_EVENTS {
  CREATE_ROOM = 'createRoom',
  JOIN_ROOM = 'joinRoom',
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
}
