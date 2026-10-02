import { hexToString } from "./colors.js";

/**
 * Renders a deck's flashcards in the deck detail view.
 * @param {{name: string, color: string, cards: Array<{question: string, answer: string}>}} deck
 * @returns {void}
 */
function renderDeckView(deck) {
  const deckViewSection = document.querySelector("#deck-view");
  const deckTitleEl = deckViewSection.querySelector(".gallery__title");
  const cardTemplateEl = deckViewSection.querySelector("#flashcard-template");
  const cardContainerEl = deckViewSection.querySelector(".gallery__list");

  deckTitleEl.textContent = deck.name;
  /** Removes previously rendered flashcards before displaying this deck. */
  cardContainerEl.querySelectorAll(":scope > li").forEach((cardEl) => {
    cardEl.remove();
  });

  /** Creates and appends one flashcard element for each card in the deck. */
  deck.cards.forEach((card) => {
    const cardEl = cardTemplateEl.content.querySelector("li").cloneNode(true);
    const flashcardEl = cardEl.classList.contains("card")
      ? cardEl
      : cardEl.querySelector(".card");
    const cardTitleEl = cardEl.querySelector(".card__title");
    const flipBtn = cardEl.querySelector(".card__flip-btn");
    const deleteBtn = cardEl.querySelector(".card__delete-btn");

    flashcardEl.classList.add(`card_color_${hexToString(deck.color)}`);
    cardTitleEl.textContent = card.question;

    /** Toggles the displayed text between the current card's question and answer. */
    flipBtn.addEventListener("click", () => {
      const isFlipped = flashcardEl.classList.toggle("card_color_white");
      cardTitleEl.textContent = isFlipped ? card.answer : card.question;
    });

    /** Removes this flashcard element from the deck view. */
    deleteBtn.addEventListener("click", () => {
      cardEl.remove();
    });

    cardContainerEl.append(cardEl);
  });
}

export { renderDeckView };
