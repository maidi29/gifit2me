import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../../services/socket.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  movies = [];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.fetchMovies();
    this.socketService.onFetchMovies().subscribe((data: any) => this.movies = data)
  }

}
