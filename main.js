// Array of card image paths (1-52 representing a deck of cards)
const cardImages = [
  'images/1.png', 'images/2.png', 'images/3.png', 'images/4.png', 'images/5.png', 
  'images/6.png', 'images/7.png', 'images/8.png', 'images/9.png', 'images/10.png', 
  'images/11.png', 'images/12.png', 'images/13.png', 'images/14.png', 'images/15.png', 
  'images/16.png', 'images/17.png', 'images/18.png', 'images/19.png', 'images/20.png', 
  'images/21.png', 'images/22.png', 'images/23.png', 'images/24.png', 'images/25.png', 
  'images/26.png', 'images/27.png', 'images/28.png', 'images/29.png', 'images/30.png', 
  'images/31.png', 'images/32.png', 'images/33.png', 'images/34.png', 'images/35.png', 
  'images/36.png', 'images/37.png', 'images/38.png', 'images/39.png', 'images/40.png', 
  'images/41.png', 'images/42.png', 'images/43.png', 'images/44.png', 'images/45.png', 
  'images/46.png', 'images/47.png', 'images/48.png', 'images/49.png', 'images/50.png', 
  'images/51.png', 'images/52.png'
];

// Image for the back of a card
const backOfCard = 'images/back.png';

// Game state variables
let currentCardIndex = Math.floor(Math.random() * 52); // Selects a random starting card
let rounds = 0; // Tracks number of rounds played
let score = 0; // Tracks player's score
let gameActive = true; // Determines if the game is active

// Initialize game display
document.getElementById('current-card').src = cardImages[currentCardIndex];
document.getElementById('round-number').innerText = rounds + 1;
document.getElementById('score').innerText = score;

// Hide restart button initially
document.getElementById("restart-btn").style.display = "none";

// Function to get the name of a card based on its index
function getCardName(cardIndex) {
  const ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
  const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
  return ranks[cardIndex % 13] + " of " + suits[Math.floor(cardIndex / 13)];
}

// Function to handle user guess (higher or lower)
function guess(choice) {
  if (!gameActive) return; // Prevents further input if game is over

  const oldCurrentCardIndex = currentCardIndex; // Stores previous card
  let nextCardIndex = Math.floor(Math.random() * 52); // Draws a new random card
  let result = document.getElementById('result');
  
  let currentCardValue = getCardValue(oldCurrentCardIndex);
  let nextCardValue = getCardValue(nextCardIndex);
  let currentColor = getCardColor(oldCurrentCardIndex);
  let nextColor = getCardColor(nextCardIndex);
  
  let userWon = false; // Tracks if the user guessed correctly

  // Compare values of current and next card
  if (currentCardValue === nextCardValue) {
    // Handle tie case based on color priority
    if (currentColor === nextColor) {
      result.innerText = "It's a draw (both " + currentColor + ")! No round counted. Try again!";
      currentCardIndex = nextCardIndex;
      document.getElementById('current-card').src = cardImages[currentCardIndex];
      return;
    } else {
      let tieWinner = (nextColor === 'black') ? 'next' : 'current';
      if ((tieWinner === 'next' && choice === 'higher') || (tieWinner === 'current' && choice === 'lower')) {
        score++;
        userWon = true;
        result.innerText = "You guessed right! (Black wins tie) The next card was " + getCardName(nextCardIndex) + ".";
      } else {
        result.innerText = "You guessed wrong. (Black wins tie) The next card was " + getCardName(nextCardIndex) + ".";
      }
    }
  } else {
    // Normal higher/lower comparison
    if ((choice === 'higher' && nextCardValue > currentCardValue) ||
        (choice === 'lower' && nextCardValue < currentCardValue)) {
      score++;
      userWon = true;
      result.innerText = "You guessed right! The next card was " + getCardName(nextCardIndex) + ".";
    } else {
      result.innerText = "You guessed wrong. The next card was " + getCardName(nextCardIndex) + ".";
    }
  }

  // Update the displayed card
  currentCardIndex = nextCardIndex;
  document.getElementById('current-card').src = cardImages[currentCardIndex];

  // Increment round and update UI
  rounds++;
  document.getElementById('round-number').innerText = rounds === 5 ? rounds : rounds + 1;
  document.getElementById('score').innerText = score;

  // Update game history
  let historyList = document.getElementById('history-list');
  let li = document.createElement('li');

  let roundDiv = document.createElement('div');
  roundDiv.classList.add('round-history');

  let roundPara = document.createElement('p');
  roundPara.textContent = `Round ${rounds}:`;
  roundDiv.appendChild(roundPara);

  let cardHistoryDiv = document.createElement('div');
  cardHistoryDiv.classList.add('card-history');

  let imgOld = document.createElement('img');
  imgOld.src = cardImages[oldCurrentCardIndex];
  imgOld.alt = getCardName(oldCurrentCardIndex);
  imgOld.classList.add('history-card');
  cardHistoryDiv.appendChild(imgOld);

  let imgNext = document.createElement('img');
  imgNext.src = cardImages[nextCardIndex];
  imgNext.alt = getCardName(nextCardIndex);
  imgNext.classList.add('history-card');
  cardHistoryDiv.appendChild(imgNext);

  roundDiv.appendChild(cardHistoryDiv);

  let resultPara = document.createElement('p');
  let strongElem = document.createElement('strong');
  strongElem.textContent = 'Result:';
  resultPara.appendChild(strongElem);
  resultPara.appendChild(document.createTextNode(` ${userWon ? 'Win' : 'Loss'}`));
  roundDiv.appendChild(resultPara);

  li.appendChild(roundDiv);
  historyList.appendChild(li);

  // Check if game is over
  if (rounds === 5) {
    result.innerText += "\nGame over! Your score is " + score + " out of 5.";
    gameActive = false;
    disableButtons();
  }
}

// Function to restart the game
function restartGame() {
  rounds = 0;
  score = 0;
  gameActive = true;
  document.getElementById('round-number').innerText = rounds + 1;
  document.getElementById('score').innerText = score;
  document.getElementById('result').innerText = "";
  document.getElementById('history-list').innerHTML = "";
  currentCardIndex = Math.floor(Math.random() * 52);
  document.getElementById('current-card').src = cardImages[currentCardIndex];
  enableButtons();
}

// Function to quit the game
function quitGame() {
  gameActive = false;
  document.getElementById('result').innerText = "You gave up! Final score: " + score + " out of " + rounds + ".";
  disableButtons();
}

// Function to hide action buttons and show restart button
function disableButtons() {
  document.querySelector(".buttons").style.display = "none";
  document.getElementById("quit-btn").style.display = "none";
  document.getElementById("restart-btn").style.display = "inline-block";
}

// Function to show action buttons and hide restart button
function enableButtons() {
  document.querySelector(".buttons").style.display = "flex";
  document.getElementById("quit-btn").style.display = "inline-block";
  document.getElementById("restart-btn").style.display = "none";
}

// Function to get numerical card value for comparison
function getCardValue(cardIndex) {
  let value = (cardIndex % 13) + 1;
  return value === 1 ? 14 : value; // Ace is highest
}

// Function to determine if a card is red or black
function getCardColor(cardIndex) {
  return Math.floor(cardIndex / 13) % 2 === 0 ? 'black' : 'red';
}
