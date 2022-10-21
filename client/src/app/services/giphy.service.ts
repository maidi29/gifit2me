import { Injectable } from '@angular/core';
import {HttpClient, HttpStatusCode} from "@angular/common/http";
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
    downsized: Image,
    fixed_width_small: Image
  }
}

export interface GiphyResult {
  data: ResultItem[],
  pagination: {
    total_count: number,
    count: number,
    offset: number
  },
  meta: {
    status: HttpStatusCode,
    msg: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  private apiKey = environment.giphyKey;

  constructor(private http: HttpClient) { }

  public getGifsBySearchInput(input: string, offset = 0): Observable<GiphyResult>  {
    return this.http.get<GiphyResult>(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${input}&limit=10&offset=${offset}&rating=g&lang=en`)
  }

  public getGifsByIds(ids: string[]): Observable<GiphyResult>  {
    return this.http.get<GiphyResult>(`https://api.giphy.com/v1/gifs?api_key=${this.apiKey}&ids=${ids.join(',')}`)
  }
}
