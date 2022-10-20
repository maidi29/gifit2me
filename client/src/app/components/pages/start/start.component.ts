import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  movies = [];

  constructor(private socketService: SocketService, private router: Router) { }

  ngOnInit(): void {
    this.socketService.fetchMovies();
    this.socketService.onFetchMovies().subscribe((data: any) => this.movies = data)
  }

  public startGame (newGame: boolean): void {
    this.router.navigate(['/game']);
  }

}
