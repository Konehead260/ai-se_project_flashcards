import { hexToString, removeColorClasses } from "./colors.js";

/**
 * Renders a deck's flashcards in the practice carousel and wires its controls.
 * @param {{name: string, color: string, cards: Array<{question: string, answer: string}>}} deck
 * @returns {void}
 */
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

  /**
   * Builds the carousel heading with the deck name and current card position.
   * @param {{name: string}} deck - The deck being practiced.
   * @param {number} currentIndex - Zero-based index of the current card.
   * @returns {string} The formatted deck name and one-based card position.
   */
  function getCarouselTitleString(deck, currentIndex) {
    const deckName = deck.name;
    return `${deckName} &middot; ${currentIndex + 1}/${deck.cards.length}`;
  }

  removeColorClasses(cardEl);
  const color = hexToString(deck.color);
  cardEl.classList.add(`carousel__card_color_${color}`);

  /** Enables or disables the navigation arrows for the current card position. */
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

  /** Updates the card text, carousel title, and navigation button states. */
  function updateDisplay() {
    updateArrows();
    const currentCard = deck.cards[currentIndex];
    cardTitleEl.innerHTML = getCarouselTitleString(deck, currentIndex);
    currentCard.question = deck.cards[currentIndex].question;
    currentCard.answer = deck.cards[currentIndex].answer;
    cardTextEl.textContent = currentCard.question;
  }

  /**
   * Disables a carousel button and applies its disabled styling.
   * @param {HTMLButtonElement} buttonEl - The button to disable.
   * @returns {void}
   */
  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }
  /**
   * Enables a carousel button and removes its disabled styling.
   * @param {HTMLButtonElement} buttonEl - The button to enable.
   * @returns {void}
   */
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  /** Advances to the next card when one is available. */
  rightBtn.onclick = () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      cardEl.classList.remove("carousel__card_color_white");
      const currentCard = deck.cards[currentIndex];
      cardTextEl.textContent = currentCard.question;
      updateDisplay();
    }
  };

  /** Goes back to the previous card when one is available. */
  leftBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      cardEl.classList.remove("carousel__card_color_white");
      const currentCard = deck.cards[currentIndex];
      cardTextEl.textContent = currentCard.question;
      updateDisplay();
    }
  };

  /** Toggles the current card between its question and answer. */
  flipBtn.onclick = () => {
    const currentCard = deck.cards[currentIndex];
    showingQuestion = !showingQuestion;

    if (showingQuestion === false) {
      cardEl.classList.add("carousel__card_color_white");
      cardTextEl.textContent = currentCard.answer;
    } else {
      cardEl.classList.remove("carousel__card_color_white");
      cardTextEl.textContent = currentCard.question;
    }
  };

  updateDisplay();
}

export { renderCarouselView };
