import {Component, OnInit} from '@angular/core';
import {GiphyService} from "../../../services/giphy.service";
import {HttpStatusCode} from "@angular/common/http";
import {Observable} from "rxjs";
import {Round} from "../../../model/round.model";
import {Store} from "@ngrx/store";
import {setNewRound, setSituation, State} from "../../../reducers";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit {
  public gifResultSrcs: string[] = [];
  public hasMoreResults = false;
  public currentIndex = 0;
  public searchInput: string = "";
  public activeRound?: Round;

  constructor(private giphyService: GiphyService, private store: Store<State>, private socketService: SocketService) {
    store.select("activeRound").subscribe((activeRound) => {
      this.activeRound = activeRound;
    });
    this.socketService.onSetSituation().subscribe((situation)=> this.store.dispatch(setSituation({situation})));
  }

  ngOnInit(): void {
  }

  public search(input: string) {
    this.currentIndex = 0;
    this.gifResultSrcs = [];
    this.fetchGifs(input);
  }

  public loadMore(input: string) {
    this.currentIndex += 10;
    this.fetchGifs(input);
  }

  private fetchGifs(input: string) {
    this.giphyService.getGifsBySearchInput(input, this.currentIndex).subscribe((response) => {
      if (response.meta.status === HttpStatusCode.Ok) {
        this.gifResultSrcs.push(...response.data.map(item => item.images.fixed_width_small.url));
        this.hasMoreResults = response.pagination.total_count > (response.pagination.offset + response.pagination.count);
      }
    })
  }

}
