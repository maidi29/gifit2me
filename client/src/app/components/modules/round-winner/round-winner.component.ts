import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-round-winner',
  templateUrl: './round-winner.component.html',
  styleUrls: ['./round-winner.component.scss']
})
export class RoundWinnerComponent implements OnInit {
  @Input() winnerGifUrl?: string = '';
  @Input() winnerName?: string = '';
  public confetti = Array.from(Array(40).keys());

  constructor() { }

  ngOnInit(): void {
  }

}
