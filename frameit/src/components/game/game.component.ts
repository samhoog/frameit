import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from '../about/about.component';
import { HelpsComponent } from '../helps/helps.component';
import { MovieTitlesService } from 'src/app/services/movie-titles.service';

interface Movie { title: string, img1: string, img2: string, img3: string, img4: string, img5: string }

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

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
  allMovies: string[] = [];
  allMovies1: string[] = [];
  allMovies2: string[] = [];
  guessesLeft = 5;
  isLastGuess = false;

  constructor(public router: Router, private db: AngularFirestore, private dialogRef: MatDialog, private movieData: MovieTitlesService) {
    // Save all the movie data in movieArray
    this.db.collection<Movie>('movies').valueChanges().subscribe((res => {
      if (res) {
        this.movieArray = res;
        this.shuffleArray();
        // load the first movie once you have all the data
        this.loadNewMovie();
        // save all the titles in seperate array for searching
        this.movieArray.forEach(movie => {
          this.movieTitles.push(movie.title);
        })
      }
      this.movieData.movieTitles$.subscribe(result => {
        this.allMovies1 = result;
      });
      // if one of our movies isn't in the top 250, add it but avoid duplicates
      this.movieTitles.forEach(title => {
        if (!this.allMovies1.includes(title)) {
          this.allMovies2.push(title);
        }
      });
      // really scuffed way to get them to all load at the same time, fixing a bug
      this.allMovies = [...this.allMovies1, ...this.allMovies2];
    }))
  }

  /**
   * Randomly shuffle the array so the movies are in a random order everytime
   * https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
   */
  shuffleArray(): void {
    for (let i = this.movieArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.movieArray[i];
      this.movieArray[i] = this.movieArray[j];
      this.movieArray[j] = temp;
    }
  }

  /**
   * Choose a new movie for another round
   */
  loadNewMovie(): void {
    this.currentImage = 1;
    this.currentSelectedImage = 1;
    //this.currentMovie = this.movieArray[Math.floor(Math.random() * this.movieArray.length)];
    if (this.currentIndex === this.movieArray.length - 1) {
      // if you're at the end of the array, go back to the first movie
      this.currentMovie = this.movieArray[0];
      this.currentIndex = 0;
    } else {
      // otherwise show the next movie in the array
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
    if (this.guessesLeft == 2) {
      this.isLastGuess = true;
    } else {
      this.guessesLeft--;
    }
    this.filteredMovies = [];
    // if they got the right answer
    if (this.searchedText.toLowerCase().trim() === this.currentMovie.title.toLowerCase()) {
      // show the congrats element and clear the searched text
      this.isCorrect = true;
      this.searchedText = '';
      this.wrongGuesses = [];
      this.currentImage = 5;
      this.guessesLeft = 5;
      this.isLastGuess = false;
    } else {
      // otherwise show the next image and save the wrong guess
      this.isCorrect = false;
      if (this.searchedText.trim() == '') {
        this.wrongGuesses.push("SKIPPED");
      } else {
        this.wrongGuesses.push(this.searchedText);
      }
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
      this.guessesLeft = 5;
      this.isLastGuess = false;
    } else {
      this.currentImage++;
      this.currentSelectedImage = this.currentImage;
    }
  }

  /**
   * Search the movieTitles array for the text the user has typed
   */
  searchMovies(): void {
    if (this.searchedText.trim() === "") {
      this.filteredMovies = [];
    } else {
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

  /**
   * When you click a button in the search bar, choose it as the answer
   * @param clickedMovie - the movie title they clicked
   */
  fillInMovie(clickedMovie: string): void {
    this.searchedText = clickedMovie;
    this.filteredMovies = [];
    this.checkAnswer();
  }

  /**
   * Open the about modal
   * from: https://www.youtube.com/watch?v=FThtv9iorao
   */
  openAbout(): void {
    this.dialogRef.open(AboutComponent);
  }

  /**
   * Open the help modal
   * from: https://www.youtube.com/watch?v=FThtv9iorao
   */
  openHelp(): void {
    this.dialogRef.open(HelpsComponent);
  }
}
