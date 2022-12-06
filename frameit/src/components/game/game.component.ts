import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from '../about/about.component';
import { HelpsComponent } from '../helps/helps.component';

interface Movie { title: string, img1: string, img2: string, img3: string, img4: string, img5: string }
interface Results { title: string }
interface Movies { results: Results[] }

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  movieArray: Movie[] = [];
  currentMovie: Movie = this.movieArray[0];
  movieTitles: string[] = [];
  filteredMovies: string[] = [];
  wrongGuesses: string[] = [];
  currentImage = 1;
  currentSelectedImage = 1;
  currentIndex = -1;
  searchedText = '';
  isCorrect = false;
  lost = false;
  data = [];
  allMovies: any[] = [];

  constructor(public router: Router, private db: AngularFirestore, private dialogRef: MatDialog) {
    // Save all the movie data in movieArray
    this.db.collection<Movie>('movies').valueChanges().subscribe((res => {
      if (res) {
        this.movieArray = res;
        // load the first movie once you have all the data
        this.loadNewMovie();
        // save all the titles in seperate array for searching
        this.movieArray.forEach(movie => {
          this.movieTitles.push(movie.title);
        })
      }
      this.fetchData();
    }))
  }

  async fetchData() {
    // try getting the json data
    let data = []
    try {
      const response = await fetch('https://imdb-api.com/en/API/Top250Movies/k_oarrley0');
      const responseData = await response.json();
      data = responseData?.items;
      // if it failed, catch and print the error
    } catch (err) {
      console.error('Fetch Error :-S', err);
    }
    this.allMovies = data.map((movie: any) => movie['title']);
    this.movieTitles.forEach(title => {
      if (!this.allMovies.includes(title)) {
        this.allMovies.push(title);
      }
    });
  }

  /**
   * Choose a new movie for another round
   */
  loadNewMovie(): void {
    // Choose a random movie from the array of movies
    this.currentImage = 1;
    this.currentSelectedImage = 1;
    //this.currentMovie = this.movieArray[Math.floor(Math.random() * this.movieArray.length)];
    if (this.currentIndex === this.movieArray.length - 1) {
      this.currentMovie = this.movieArray[0];
    } else {
      this.currentIndex++;
      this.currentMovie = this.movieArray[this.currentIndex];
    }
    this.isCorrect = false;
    this.lost = false;
  }

  /**
   * Check to see if the user entered the correct answer
   */
  checkAnswer(): void {
    // if they got the right answer
    if (this.searchedText.toLowerCase() === this.currentMovie.title.toLowerCase()) {
      // show the congrats element and clear the searched text
      this.isCorrect = true;
      this.searchedText = '';
      this.filteredMovies = [];
      this.wrongGuesses = [];
      this.currentImage = 5;
    } else {
      this.isCorrect = false;
      this.wrongGuesses.push(this.searchedText);
      this.nextImage();

    }
  }

  /**
   * Move to the next image for guessing
   */
  nextImage(): void {
    this.searchedText = '';
    if (this.currentImage === 5) {
      this.lost = true;
      this.wrongGuesses = [];
    } else {
      this.currentImage++;
      this.currentSelectedImage = this.currentImage;
    }
  }

  /**
   * Search the movieTitles array for the text the user has typed
   */
  searchMovies(): void {
    if (this.searchedText === "") {
      this.filteredMovies = [];
    } else {
      //this.filteredMovies = this.movieTitles.filter((title) => title.toLowerCase().includes(this.searchedText.toLowerCase()));
      this.filteredMovies = this.allMovies.filter((title) => title.toLowerCase().includes(this.searchedText.toLowerCase()));
    }
  }

  /**
   * Set the currently displayed image (has to differ from currentImage so you can go back and view old images)
   * @param index - the image they are clicking back to
   */
  setSelectedImage(index: number): void {
    this.currentSelectedImage = index;
  }

  fillInMovie(clickedMovie: string): void {
    this.searchedText = clickedMovie;
    this.filteredMovies = [];
  }

  ngOnInit(): void {
  }

  openAbout(): void {
    this.dialogRef.open(AboutComponent);
  }

  openHelp(): void {
    this.dialogRef.open(HelpsComponent);
  }
}
