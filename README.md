# Hangman Game

A classic **Hangman** word-guessing game built with **HTML**, **CSS**, and **JavaScript**. You can play with your own word or let the game pick a random word for you.

---

## Demo

The game shows a simple gallows and stick figure. Each wrong guess adds another part to the figure. If you guess the word in time, you see a win screen; if you run out of lives, the figure is complete and the game is over.

---

## How to Play

1. **Enter a word**  
   Type any word (letters only) in the box, or click **Generate Word** to use a random word.

2. **Start the game**  
   Click **Start Game** (or press Enter).

3. **Guess letters**  
   Click the on-screen letter buttons, or type letters on your keyboard.
   - **Correct guess:** the letter appears in the word.
   - **Wrong guess:** a part is added to the hangman figure and you lose one life (you have 6 lives).

4. **Win or lose**
   - **Win:** fill in the whole word before running out of lives.
   - **Lose:** 6 wrong guesses complete the figure and the game ends.

5. **Restart or new game**
   - **Restart** – same word, reset guesses and lives.
   - **New Game** – go back to the word input screen and enter or generate a new word.

---

## How to Run the Project

1. **Open the folder**  
   Make sure you have the project folder on your computer (e.g. `Hangman in Javascript`).

2. **Run a local server (recommended)**  
   Because the game uses JavaScript modules/APIs, it’s best to open it through a local server instead of double‑clicking the HTML file.
   - **Option A – VS Code:** Install the “Live Server” extension, right‑click `index.html`, and choose “Open with Live Server”.
   - **Option B – Command line:** If you have Node.js, run:
     ```bash
     npx serve .
     ```
     Then open the URL shown (e.g. `http://localhost:3000`) in your browser.

3. **Or open the file directly**  
   You can also open `index.html` in your browser by double‑clicking it. If something doesn’t work (e.g. fetching a random word), use a local server as above.

---
