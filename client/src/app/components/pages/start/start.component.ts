import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  movies = [];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.fetchMovies();
    this.socketService.onFetchMovies().subscribe((data: any) => this.movies = data)
  }

}
