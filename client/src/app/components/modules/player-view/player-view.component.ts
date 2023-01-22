import {Component} from '@angular/core';
import {Round} from "../../../model/round.model";
import {Store} from "@ngrx/store";
import {addAnswerGif, State} from "../../../reducers/reducers";
import {SocketService} from "../../../services/socket.service";
import {Player} from "../../../model/player.model";
import {GifItem} from "../gif-search/gif-search.component";

enum ViewState { noSituation, searchGifs, waitForOthers, answersReveal, winnerDisplay}

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent {
  public ViewState = ViewState;
  public activeRound?: Round;
  public players?: Player[];
  public ownPlayer?: Player;
  public sent = false;
  public winner?: {winnerGifUrl: string, winnerName: string}
  public master = "Master";
  public state: ViewState = ViewState.noSituation;

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("activeRound").subscribe((activeRound) => {
      if(this.activeRound?.index !== activeRound?.index) {
        // reset on new round
        this.sent = false;
        this.winner = undefined;
      }
      const notAllHaveAnswered = this.players && activeRound?.answers && activeRound.answers.length < this.players.length - 1;
      if(!activeRound?.situation) {
        this.state = ViewState.noSituation;
      } else if(activeRound?.situation && !this.sent) {
        this.state = ViewState.searchGifs;
      } else if(activeRound?.answers && this.sent && notAllHaveAnswered) {
        this.state = ViewState.waitForOthers;
      } else if(!activeRound?.winner) {
        this.state = ViewState.answersReveal;
      } else if(activeRound?.winner) {
        this.winner = {
          winnerName: activeRound.winner,
          winnerGifUrl: activeRound.answers?.find(({playerName}) => playerName === activeRound.winner)?.gifUrl ?? ''
        };
        this.state = ViewState.winnerDisplay;
      }
      this.activeRound = activeRound;
    });
    store.select("players").subscribe((players) => {
      this.players = players;
      this.ownPlayer = players.find(({isSelf}) => !!isSelf);
      this.master = players.find(({isMaster})=>isMaster)?.name || "Master";
    });
  }

  public sendSelectedGif(gifItem: GifItem) {
    if (gifItem && this.ownPlayer) {
      this.sent = true;
      const answer = {playerName: this.ownPlayer.name, gifUrl: gifItem.src, flipped: false }
      this.store.dispatch(addAnswerGif({answer}));
      this.socketService.sendAnswerGif(answer);
    }
  }

}
