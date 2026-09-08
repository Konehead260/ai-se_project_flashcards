import { hexToString, removeColorClasses } from "./colors.js";

function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;

  const carouselEl = document.querySelector(".carousel");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const cardTitleEl = carouselEl.querySelector(".carousel__title");
  const cardEl = carouselEl.querySelector(".carousel__card");
  const cardTextEl = carouselEl.querySelector(".carousel__card-text");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");

  function getCarouselTitleString(deck, currentIndex) {
    const deckName = deck.name;
    return `${deckName} &middot; ${currentIndex + 1}/${deck.cards.length}`;
  }

  removeColorClasses(cardEl);
  const color = hexToString(deck.color);
  cardEl.classList.add(`carousel__card_color_${color}`);

  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === deck.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  function updateDisplay() {
    updateArrows();
    const currentCard = deck.cards[currentIndex];
    cardTitleEl.innerHTML = getCarouselTitleString(deck, currentIndex);
    currentCard.question = deck.cards[currentIndex].question;
    currentCard.answer = deck.cards[currentIndex].answer;
    cardTextEl.textContent = currentCard.question;
  }

  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  rightBtn.addEventListener("click", () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      cardEl.classList.remove("carousel__card_color_white");
      const currentCard = deck.cards[currentIndex];
      cardTextEl.textContent = currentCard.question;
      updateDisplay();
    }
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      cardEl.classList.remove("carousel__card_color_white");
      const currentCard = deck.cards[currentIndex];
      cardTextEl.textContent = currentCard.question;
      updateDisplay();
    }
  });

  flipBtn.addEventListener("click", () => {
    const currentCard = deck.cards[currentIndex];
    showingQuestion = !showingQuestion;

    if (showingQuestion === false) {
      cardEl.classList.add("carousel__card_color_white");
      cardTextEl.textContent = currentCard.answer;
    } else {
      cardEl.classList.remove("carousel__card_color_white");
      cardTextEl.textContent = currentCard.question;
    }
  });

  updateDisplay();
}

export { renderCarouselView };
