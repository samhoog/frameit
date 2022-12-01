import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface Movie { title: string, img1: string, img2: string, img3: string, img4: string, img5: string }

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
  searchedText = '';
  isCorrect = false;
  lost = false;

  constructor(public router: Router, private db: AngularFirestore) {
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
    }))
  }

  /**
   * Choose a new movie for another round
   */
  loadNewMovie(): void {
    // Choose a random movie from the array of movies
    this.currentImage = 1;
    this.currentSelectedImage = 1;
    this.currentMovie = this.movieArray[Math.floor(Math.random() * this.movieArray.length)];
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
      this.filteredMovies = this.movieTitles.filter((title) => title.toLowerCase().includes(this.searchedText.toLowerCase()));
    }
  }

  /**
   * Set the currently displayed image (has to differ from currentImage so you can go back and view old images)
   * @param index - the image they are clicking back to
   */
  setSelectedImage(index: number): void {
    this.currentSelectedImage = index;
  }

  ngOnInit(): void {
  }

}
