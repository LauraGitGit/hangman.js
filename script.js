let secretWord = "";
let guessedLetters = [];
let wrongGuesses = [];
let lives = 6;
let gameOver = false;

const wordInput = document.getElementById("secretWordInput");
const startBtn = document.getElementById("startGame");

const wordDisplay = document.getElementById("wordDisplay");
const wrongGuessesDisplay = document.getElementById("wrongGuessesDisplay");
const livesDisplay = document.getElementById("livesDisplay");
const keyboard = document.getElementById("keyboard");

startBtn.addEventListener("click", () => {
  secretWord = wordInput.value.toLowerCase().trim();
  if (!secretWord || !/^[a-z]+$/.test(secretWord)) {
    alert("Please enter a valid word with only letters.");
    return;
  }

  document.getElementById("wordInputSection").style.display = "none";
  document.getElementById("game").style.display = "block";

  guessedLetters = [];
  wrongGuesses = [];
  lives = 6;
  gameOver = false;

  updateWordDisplay();
  createKeyboard();
});

  // Allow pressing Enter to start the game
wordInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    startBtn.click();
  }
});


function updateWordDisplay() {
  const display = secretWord
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
  wordDisplay.textContent = display;
}

function createKeyboard() {
  keyboard.innerHTML = "";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  letters.split("").forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => handleGuess(letter, btn));
    keyboard.appendChild(btn);
  });
}

function updateHangmanImage() {
  const image = document.getElementById("hangmanImage");
  const stage = wrongGuesses.length;

  // Cap stage (current stage :8)
  const imageIndex = Math.min(stage, 8);
  image.src = `images/hangman-${imageIndex}.png`;

  
  image.style.opacity = 0;
  setTimeout(() => {
    image.style.opacity = 1;
  }, 100);
}

function handleGuess(letter, btn) {
    btn.disabled = true;
  if (gameOver) return;
 btn.disabled = true;


if (secretWord.includes(letter)) {
  guessedLetters.push(letter);
  btn.style.backgroundColor = "green"; // Correct guess
} else {
  wrongGuesses.push(letter);
  lives--;
 updateHangmanImage();
  wrongGuessesDisplay.textContent = wrongGuesses.join(" ");
  livesDisplay.textContent = lives;
  btn.style.backgroundColor = "darkRed"; // Wrong guess
}

  updateWordDisplay();
  checkGameOver();
}

function checkGameOver() {
  const display = secretWord
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join("");

  if (lives === 0) {
    wordDisplay.textContent = `🥴 Oof.. Try again? The word was: ${secretWord}`;
    updateHangmanImage(); // Shows final sad face
    disableAllButtons();
    gameOver = true;
  } else if (!display.includes("_")) {
    wordDisplay.textContent = `👏 Nice one! You saved him!`;
    
    // Show win image
    const image = document.getElementById("hangmanImage");
    image.src = "images/Hangman-win.png";
    
    disableAllButtons();
    gameOver = true;
  }
}


function disableAllButtons() {
  const buttons = keyboard.querySelectorAll("button");
  buttons.forEach(btn => (btn.disabled = true));
}

// Allow key presses from keyboard
document.addEventListener("keydown", function (event) {
  const letter = event.key.toLowerCase();

  // Only allow a-z, not symbols or already guessed letters
  if (/^[a-z]$/.test(letter)) {
    const button = [...keyboard.querySelectorAll("button")].find(
      btn => btn.textContent === letter
    );
    if (button && !button.disabled) {
      button.click(); // simulate click on button
    }
  }
});

// Restart game with same word
document.getElementById("restartGame").addEventListener("click", () => {
  guessedLetters = [];
  wrongGuesses = [];
  lives = 6;
  gameOver = false;

  // Reset displays
  updateWordDisplay();
  createKeyboard();
  wrongGuessesDisplay.textContent = "";
  livesDisplay.textContent = lives;
  
  // Reset hangman image
  const image = document.getElementById("hangmanImage");
  image.src = "images/hangman-0.png";
});

// Start new game (enter new word)
document.getElementById("newGame").addEventListener("click", () => {
  
  // Reset game state
  guessedLetters = [];
  wrongGuesses = [];
  lives = 6;
  gameOver = false;
  secretWord = "";

  // Reset displays
  wrongGuessesDisplay.textContent = "";
  livesDisplay.textContent = lives;
  wordDisplay.textContent = "";
  keyboard.innerHTML = "";

  // Reset word input section
  wordInput.value = "";
  document.getElementById("game").style.display = "none";
  document.getElementById("wordInputSection").style.display = "flex";
  
  // Reset hangman image
  const image = document.getElementById("hangmanImage");
  image.src = "images/hangman-0.png";
  
  
  setTimeout(() => {
    wordInput.focus();
  }, 10);
});

