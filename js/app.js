/*-------------- Constants -------------*/
const allMatchedPaires = 6;

/*---------- Variables (state) ---------*/
let timeLeft;
let timer = 0;
let matchedPaires = 0;
let flippedCards = 0;
let flippedPair = [];
let isChecking = false;
let winner = false;
let gameover = false;

/*----- Cached Element References  -----*/
const cards = document.querySelectorAll(".card");
const gameContainer = document.querySelector(".game-container");
const resetButton = document.querySelector(".reset");
const timerSpan = document.querySelector(".timer");
const playButton = document.querySelector(".play");
const message = document.querySelector(".game-message");

/*-------------- Functions -------------*/
function init() {
  playButton.textContent = "Reset";
  gameover = false;
  timeLeft = 5;
  message.textContent = "";
  clearInterval(timer);
  timerSpan.textContent = timeLeft;
  winner = false;

  timer = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft === 0) clearInterval(timer);
    if (timeLeft === 0 && !winner) {
      message.textContent = "You lose";
      gameover = true;
    }
    if (winner) clearInterval(timer);
  }, 1000);

  const cardArray = Array.from(cards);
  shuffle(cardArray, gameContainer);
  cards.forEach((card) => card.classList.remove("flipped"));
  flippedCards = 0;
  flippedPair = [];
  matchedPaires = 0;
  isPair = false;
}

// function render() {}

function shuffle(cardsArray, container) {
  for (let i = cardsArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cardsArray[i], cardsArray[randomIndex]] = [
      cardsArray[randomIndex],
      cardsArray[i],
    ];
  }
  cardsArray.forEach((card) => container.appendChild(card));
}
function checkForPairs() {
  if (matchedPaires === allMatchedPaires) {
    message.textContent = "You win";
    winner = true;
    clearInterval(timer);
  }
  return;
}

/*----------- Event Listeners ----------*/
cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (
      gameover ||
      isPair ||
      card.classList.contains("flipped") ||
      flippedPair.length === 2
    )
      return;

    card.classList.add("flipped");
    flippedPair.push(card);

    if (flippedPair.length === 2) {
      isChecking = true;
      const firstCard = flippedPair[0];
      const secondCard = flippedPair[1];

      if (firstCard.dataset.lang === secondCard.dataset.lang) {
        matchedPaires++;
        flippedPair = [];
        isPair = false;
        checkForPairs();
      } else {
        setTimeout(() => {
          firstCard.classList.remove("flipped");
          secondCard.classList.remove("flipped");
          flippedPair = [];
          isChecking = false;
        }, 700);
      }
    }
    console.log(matchedPaires);
  });
});

resetButton.addEventListener("click", init);
playButton.addEventListener("click", init);
