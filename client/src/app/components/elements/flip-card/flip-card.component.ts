import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-flip-card',
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss']
})
export class FlipCardComponent implements OnInit {
  @Input() flipped = false;
  constructor() { }

  ngOnInit(): void {
  }

}
