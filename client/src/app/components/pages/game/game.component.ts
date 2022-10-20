import { Component, OnInit } from '@angular/core';

interface Player {
  isMaster: boolean
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public ownPlayer: Player = {
    isMaster: false
  }

  constructor() { }

  ngOnInit(): void {
  }

}
