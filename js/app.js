/*-------------- Constants -------------*/
const allMatchedPaires = 6;

/*---------- Variables (state) ---------*/
let timeLeft;
let timer;
let matchedPaires;
let flippedCards;
let flippedPair;
let isChecking;
let winner;
let gameover;
let gameStarted;

/*----- Cached Element References  -----*/
const cards = document.querySelectorAll(".card");
const gameContainer = document.querySelector(".game-container");
const timerSpan = document.querySelector(".timer");
const playButton = document.querySelector(".play");
const message = document.querySelector(".game-message");
const guideButton = document.querySelector(".guide");
const guidePopup = document.querySelector(".guide-popup");
const closeButton = document.querySelector(".close");

/*-------------- Functions -------------*/
function init() {
  clearInterval(timer);
  flippedCards = 0;
  flippedPair = [];
  matchedPaires = 0;
  isChecking = false;
  gameover = false;
  winner = false;
  gameStarted = false;

  playButton.textContent = "Reset";
  message.textContent = "";
  clearInterval(timer);
  timeLeft = 50;
  timerSpan.textContent = timeLeft;

  const cardArray = Array.from(cards);
  shuffle(cardArray, gameContainer);
  cards.forEach((card) => card.classList.remove("flipped"));

  setTimeout(() => {
    cards.forEach((card) => card.classList.add("flipped"));

    setTimeout(() => {
      cards.forEach((card) => card.classList.remove("flipped"));
      gameStarted = true;

      timer = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;

        if (timeLeft === 0 && !winner) {
          clearInterval(timer);
          message.textContent = "⏱️ Time’s Up!";
          gameover = true;
        }

        if (winner) clearInterval(timer);
      }, 1000);
    }, 3000);
  }, 300);
}

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
    message.textContent = "🎉 You Win! Great Memory!";
    winner = true;
    clearInterval(timer);
  }
}

/*----------- Event Listeners ----------*/
cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (
      !gameStarted ||
      gameover ||
      isChecking ||
      card.classList.contains("flipped") ||
      flippedPair.length === 2
    )
      return;

    card.classList.add("flipped");
    flippedPair.push(card);

    if (flippedPair.length === 2) {
      isChecking = true;
      const [firstCard, secondCard] = flippedPair;

      if (firstCard.dataset.lang === secondCard.dataset.lang) {
        matchedPaires++;
        flippedPair = [];
        isChecking = false;
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
  });
});

playButton.addEventListener("click", init);
guideButton.addEventListener("click", () => {
  guidePopup.classList.remove("hidden");
});
closeButton.addEventListener("click", () => {
  guidePopup.classList.add("hidden");
});
