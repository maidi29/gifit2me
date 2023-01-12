import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GiphyService} from "../../../services/giphy.service";
import {HttpStatusCode} from "@angular/common/http";
import {Observable} from "rxjs";
import {Round} from "../../../model/round.model";
import {Store} from "@ngrx/store";
import {addAnswerGif, setNewRound, setSituation, State} from "../../../reducers";
import {SocketService} from "../../../services/socket.service";
import {Player} from "../../../model/player.model";
import {NgxMasonryComponent} from "ngx-masonry";

export interface GifItem { small: string, src: string, id: string };

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit {
  public gifResultSrcs: GifItem[] = [];
  public hasMoreResults = false;
  public currentIndex = 0;
  public searchInput: string = "";
  public activeRound?: Round;
  public selectedGif?: GifItem;
  public players?: Player[];
  public ownPlayer?: Player;
  public sent = false;
  public winner?: {winnerGifUrl: string, winnerName: string}
  @ViewChild(NgxMasonryComponent) masonry?: NgxMasonryComponent;


  constructor(private giphyService: GiphyService, private store: Store<State>, private socketService: SocketService, private host: ElementRef) {
    store.select("activeRound").subscribe((activeRound) => {
      if(this.activeRound?.index !== activeRound) {
        // reset on new round
        this.sent = false;
        this.winner = undefined;
        this.searchInput = "";
        this.currentIndex = 10;
        this.hasMoreResults = false;
        this.gifResultSrcs = [];
      }
      this.activeRound = activeRound;
    });
    store.select("players").subscribe((players) => {
      this.players = players;
      this.ownPlayer = players.find(({isSelf}) => !!isSelf)
    });
  }

  ngOnInit(): void {
    const observer = new ResizeObserver(entries => {
      this.masonry?.reloadItems();
      this.masonry?.layout();
    });
    observer.observe(this.host.nativeElement);
  }

  // Todo: search on enter
  // Todo: error handling for gif request
  public search(input: string) {
    this.currentIndex = 0;
    this.gifResultSrcs = [];
    this.fetchGifs(input);
  }

  public loadMore(input: string) {
    this.currentIndex += 10;
    this.fetchGifs(input);
  }

  public sendSelectedGif() {
    if (this.selectedGif && this.ownPlayer) {
      const answer = {playerName: this.ownPlayer.name, gifUrl: this.selectedGif.src, flipped: false }
      this.store.dispatch(addAnswerGif({answer}));
      this.socketService.sendAnswerGif(answer);
      this.sent = true;
      this.selectedGif = undefined;
    }
  }

  private fetchGifs(input: string) {
    this.giphyService.getGifsBySearchInput(input, this.currentIndex).subscribe((response) => {
      if (response.meta.status === HttpStatusCode.Ok) {
        this.gifResultSrcs.push(...response.data.map(item => ({
          small: item.images.fixed_width_small.url,
          src: item.images.original.url,
          id: item.id
        })));
        this.masonry?.reloadItems();
        this.masonry?.layout();
        this.hasMoreResults = response.pagination.total_count > (response.pagination.offset + response.pagination.count);
      }
    })
  }

}
