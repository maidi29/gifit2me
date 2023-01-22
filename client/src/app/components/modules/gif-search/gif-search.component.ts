import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GiphyService} from "../../../services/giphy.service";
import {Store} from "@ngrx/store";
import {State} from "../../../reducers/reducers";
import {Round} from "../../../model/round.model";
import {NgxMasonryComponent} from "ngx-masonry";
import {HttpStatusCode} from "@angular/common/http";

export interface GifItem { small: string, src: string, id: string }

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.scss']
})
export class GifSearchComponent implements OnInit {
  public activeRound?: Round;
  public gifResultSrcs: GifItem[] = [];
  public hasMoreResults = false;
  public currentIndex = 0;
  public searchInput: string = "";
  public selectedGif?: GifItem;
  public gifSearchErrorMessage?: string;
  @ViewChild(NgxMasonryComponent) masonry?: NgxMasonryComponent;
  @Output() sendGif: EventEmitter<GifItem> = new EventEmitter<GifItem>();

  constructor(private giphyService: GiphyService, private store: Store<State>, private host: ElementRef) {
    store.select("activeRound").subscribe((activeRound) => {
      if (this.activeRound?.index !== activeRound?.index) {
        // reset on new round
        this.searchInput = "";
        this.currentIndex = 0;
        this.hasMoreResults = false;
        this.gifResultSrcs = [];
        this.gifSearchErrorMessage = undefined;
      }
    });
  }

  ngOnInit(): void {
    const observer = new ResizeObserver(() => {
      this.masonry?.reloadItems();
      this.masonry?.layout();
    });
    observer.observe(this.host.nativeElement);
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

  public sendSelectedGif() {
    this.sendGif.emit(this.selectedGif);
    this.selectedGif = undefined;
  }

  private fetchGifs(input: string) {
    this.giphyService.getGifsBySearchInput(input, this.currentIndex).subscribe((response) => {
      if (response.meta.status === HttpStatusCode.Ok) {
        if(response.data.length === 0) {
          this.gifSearchErrorMessage = "No results"
        }
        this.gifResultSrcs.push(...response.data.map(item => ({
          small: item.images.fixed_width_small.url,
          src: item.images.original.url,
          id: item.id
        })));
        this.masonry?.reloadItems();
        this.masonry?.layout();
        this.hasMoreResults = response.pagination.total_count > (response.pagination.offset + response.pagination.count);
      } else {
        this.gifSearchErrorMessage = response.meta.msg;
      }
    })
  }
}
