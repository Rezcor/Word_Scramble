/*
----------------------------------------------------------------
80s themed hangman game
----------------------------------------------------------------
*/

const artistData = {
    "John Lennon": "Just Like Starting Over (1981)",
    "Blondie": "The Tide Is High (1981)",
    "Kool & The Gang": "Celebration (1981)",
    "REO Speedwagon": "Keep On Loving You (1981)",
    "Hall & Oates": "Kiss On My List, Private Eyes (1981)",
    "Rick Springfield": "Jessie’s Girl (1981)",
    "Diana Ross & Lionel Richie": "Endless Love (1981)",
    "Olivia Newton-John": "Physical (1981)",
    "Survivor":	"Eye of the Tiger (1982)",
    "Paul McCartney & Stevie Wonder":	"Ebony and Ivory (1982)",
    "Toto":	"Africa (1983)",
    "Michael Jackson":	"Beat It (1983)",
    "Eurythmics":	"Sweet Dreams (1983)", 
    "The Police":	"Every Breath You Take (1983)",
    "David Bowie":	"Let’s Dance (1983)",
    "Madonna": "Like A Virgin (1984), Crazy for You (1985)",
    "Prince": "When Doves Cry (1984)",
    "Duran Duran": "The Reflex (1984)",
    "Cyndi Lauper": "Time After Time (1984)",
    "Culture Club": "Karma Chameleon (1984)",
    "Van Halen": "Jump (1984)",
    "Tears for Fears": "Everybody Wants to Rule the World (1985)",
    "a-ha": "Take On Me (1985)",
    "Heart": "These Dreams (1986), Alone (1987)",
    "Whitney Houston": "Greatest Love of All (1986)",
    "Bon Jovi": "You Give Love a Bad Name (1986)",
    "The Bangles": "Walk Like an Egyptian (1986)",
    "U2": "With or Without You (1987)",
    "Guns N' Roses": "Sweet Child O' Mine (1988)",
    "UB40": "Red Red Wine (1988)",
    "The Beach Boys": "Kokomo (1988)",
    "Bobby Brown": "My Prerogative (1989)",
    "Paula Abdul": "Straight Up (1989)",
  }
  
  /*
  ----------------------------------------------------------------
  A class for the word guess game
  ----------------------------------------------------------------
  */
  class Game80s {
    constructor(remainingAttempts = 6) {
      this.started = false; // game state boolean
      this.answer = "";     // an original answer word/string
      this.ansLetters = []; // unique letters of the answer
      this.ansDisplay = []; // "_ _ _ _" on the web page
      this.numWins = 0;     // the number of wins counter  
      this.remaining = remainingAttempts; // remaining attempts counter
    }
  
    //
    // (re-)start by initializing the variables
    //
    start(remainingGuess = this.remaining) {
      this.remaining = remainingGuess;
      this.answer = this.pickAnswer(artistData);
      this.ansLetters = this.initAnswerLetters(this.answer);
      this.ansDisplay = this.initAnswerDisplay(this.answer);
      this.started = true;
    }
  
    //
    // Choose string from an array
    //
    pickAnswer(inputData) {
      let arrayData = [];
      for (let name in inputData) {
        arrayData.push(name);
      }
      let ndx = Math.floor(Math.random() * arrayData.length);
  
      return arrayData[ndx];
    }
  
    //
    // Initialize unique answer letters in an array, all in lower-case 
    //
    initAnswerLetters(ansStr) {
      let ansLetters = [];
      for (let i = 0; i < ansStr.length; i++) {
        let ansChar = ansStr.charAt(i).toLowerCase();
        if (/^\w$/.test(ansChar)) {
          ansLetters.push(ansChar);
        }
      }
  
      return new Set(ansLetters);
    }
  
    //
    // Initialize ansDisplay i.e. "_ _ _ _" for the web page
    // non-alphanumeric characters will be shown
    //
    initAnswerDisplay(ansStr) {
      let ansDisplay = [];
      for (let i = 0; i < ansStr.length; i++) {
        let ansChar = ansStr[i];
        ansDisplay[i] = ansChar;
        if (/\w/.test(ansChar)) {
          ansDisplay[i] = " _ ";
        }
      }
  
      return ansDisplay;
    }
  
    //
    // Update the game data
    // inputChar parameter should be in lower-case
    //  
    updateGameData(inputChar) {
      // Set.delete() returns true if inputChar has been deleted
      if (this.ansLetters.delete(inputChar)) {
        this.updateAnsDisplay(inputChar);
        if (this.userWon()) {
          this.numWins++;
          return true;
        }
      } else {
        this.remaining--;
      }
  
      return false;
    }
  
    //
    // Update the word displayed on the page
    //  
    updateAnsDisplay(char) {
      console.log("char: =>" + char + "<- word: " + this.answer);
  
      for (let i = 0; i < this.answer.length; i++) {
        if (this.answer.charAt(i).toLowerCase() === char) {
          this.ansDisplay[i] = this.answer[i];
          console.log("got " + char + "  word: " + this.ansDisplay);
        }
      }
  
      return this.ansDisplay;
    }
  
    //
    // Determine whether the user guessed all letters or not
    //
    userWon() {
      if (this.ansLetters.size == 0) {
        return true;
      }
      return false;
    }
  
    //
    // Hint for the current answer key
    //
    hint() {
      return artistData[this.answer];
    }
  }
  
  /*
  ----------------------------------------------------------------
    A class for the game web page
  ----------------------------------------------------------------
  */
  class WebElems {
    constructor(game = new Game80s()) {
      this.startMsg = document.getElementById("start");
      this.numWins = document.getElementById("num-wins");
      this.answer = document.getElementById("question");
      this.remaining = document.getElementById("remaining-guesses");
      this.guessed = document.getElementById("already-guessed");
      this.game = game;
    }
  
    //
    // Takes user key input and play the game
    //  
    handleKeyInput(userInput) {
      console.log("input: " + userInput);
  
      if (this.game.started) {
        this.startMsg.style.visibility = "hidden";
  
        // ignore ctrl, shift, etc. key stroke
        if (/^[\w~!@#$%^&*()_+=,.]$/.test(userInput)) {
          console.log("answer: " + this.game.answer);
          if (this.game.updateGameData(userInput.toLowerCase())) {
            this.start();
            userInput = ""; // user won, so reset
          } else {
            if (this.game.remaining === 0) {
              userInput = "";
            }
          }
          this.updatePage(userInput);
        }
      } else {
        // the very initial state or user lost
        if (this.game.remaining === 0) {
          this.startMsg.style.visibility = "hidden";
        }
        this.start();
      }
    }
  
    //
    // (re-)start the game
    //
    start(remainingGuess = 6) {
      this.game.start(remainingGuess);
      this.guessed.textContent = "";
      this.updatePage("");
      $("#hint").text("");
    }
  
    //
    // Update the page with the game data
    //  
    updatePage(inputChar) {
      this.numWins.textContent = this.game.numWins;
      this.answer.textContent = this.game.ansDisplay.join("");
      this.remaining.textContent = this.game.remaining;
      this.guessed.textContent += inputChar.toUpperCase();
  
      if (this.game.remaining === 0) {
        this.showAnswer();
        this.game.started = false;
      }
    }
  
    //
    // User lost, so show the answer
    //
    showAnswer() {
      this.answer.textContent = this.game.answer;
      this.startMsg.style.visibility = "visible";
    }
  
    //
    // Hint for the current answer key
    //
    hint() {
      return this.game.hint();
    }
  }
  