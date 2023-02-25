import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {resetAll, State} from "./reducers/reducers";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store<State>) {}

  ngOnInit() {
    window.onbeforeunload = () => {
      this.store.dispatch(resetAll());
    }
  }
}
