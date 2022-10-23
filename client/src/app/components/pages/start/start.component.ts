import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  private roomId?: number;

  constructor(private socketService: SocketService, private router: Router) { }

  ngOnInit(): void {
  }

  public startGame (newGame: boolean): void {
    if (newGame) {
      this.socketService.createRoom({
        name: "dummy",
        score: 0,
        avatar: "tbd",
        isMaster: true
      });

    }
    this.socketService.onCreateRoom().subscribe((roomId: number) => {
      // Todo: error handling
      // Todo: store
      this.roomId = roomId;
      this.router.navigate(['/game']);
    })
  }

}
