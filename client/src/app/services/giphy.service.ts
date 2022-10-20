import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

interface Image {
  height: string,
  width: string,
  size: string,
  url: string
}

interface ResultItem {
  type: string,
  id: string,
  url: string,
  source: string,
  title: string,
  rating: 'g' | 'r' | 'pg-13' | 'pg',
  import_datetime: Date
  images: {
    original: Image,
    downsized: Image
  }

}

export interface GiphyResult {
  data: ResultItem[],
  pagination: {

  },
  meta: {

  }
}

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  private apiKey = environment.giphyKey;

  constructor(private http: HttpClient) { }

  public getGifsBySearchInput(input: string): Observable<GiphyResult>  {
    return this.http.get<GiphyResult>(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${input}&limit=10&offset=0&rating=g&lang=en`)
  }

  public getGifsByIds(ids: string[]): Observable<GiphyResult>  {
    return this.http.get<GiphyResult>(`https://api.giphy.com/v1/gifs?api_key=${this.apiKey}&ids=${ids.join(',')}`)
  }
}
