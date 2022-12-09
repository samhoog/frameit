import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieTitlesService {
  allMovies: string[] = [];
  public movieTitles$ = new BehaviorSubject<string[]>([]);

  constructor() { this.fetchData(); }

  async fetchData() {
    // try getting the json data
    let data = []
    try {
      const response = await fetch('https://imdb-api.com/en/API/Top250Movies/k_ahz4tt52');
      const responseData = await response.json();
      data = responseData?.items;
      // if it failed, catch and print the error
    } catch (err) {
      console.error('Fetch Error :-S', err);
    }
    // extract all the titles and add it to the array of allMovies
    this.allMovies = data.map((movie: any) => movie['title']);
    this.movieTitles$.next(this.allMovies);
  }
}
