import { Component, OnInit } from '@angular/core';
import {GiphyService} from "../../../services/giphy.service";

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit {

  constructor(private giphyService: GiphyService) { }

  ngOnInit(): void {
  }

  public search(input: string) {
    this.giphyService.getGifsBySearchInput(input).subscribe((response) => {
      console.log(response);
    })
  }

}
