import { getDeckByID, fetchedDecks } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { disableSubmitBtn } from "./new-deck-view.js";
import { getDecks, deleteDeck } from "./api.js";
import { showError } from "./new-deck-view.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const newDeckSection = document.querySelector("#new-deck");
const aboutSection = document.querySelector("#about");

const pageEl = document.querySelector(".page");
const pageContentEl = document.querySelector(".page__main-content");
const deckTemplateEl = document.querySelector("#card-template");
const deckContainerEl = homeSection.querySelector(".gallery__list");
const practiceBtn = deckViewSection.querySelector(".gallery__practice-btn");
const homeNewDeckBtn = document.querySelector("#home .gallery__new-card-btn");

let currentDeck = null;

/** Navigates to the current deck's practice carousel when Practice is clicked. */
practiceBtn.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `carousel/${currentDeck._id}`;
  }
});

/** Navigates to the new-deck form when the home button is clicked. */
homeNewDeckBtn.addEventListener("click", () => {
  window.location.hash = "new-deck";
});

/** Displays the home gallery and hides all other page sections. */
function renderHomeView() {
  pageEl.classList.remove("page_no-mobile-bar");
  homeSection.style.display = "block";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "none";
  aboutSection.style.display = "none";
}

/** Displays the not-found section and hides all other page sections. */
function renderNotFoundView() {
  pageEl.classList.add("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
  newDeckSection.style.display = "none";
  aboutSection.style.display = "none";
}

/**
 * Displays a deck's detail view and makes that deck the current deck.
 * @param {object} deck - The deck to display.
 * @returns {void}
 */
function renderDeckViewForDeck(deck) {
  currentDeck = deck;
  pageEl.classList.remove("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "none";
  aboutSection.style.display = "none";

  renderDeckView(deck);
}

/**
 * Displays a deck's practice carousel.
 * @param {object} deck - The deck to practice.
 * @returns {void}
 */
function renderCarouselViewForDeck(deck) {
  pageEl.classList.add("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "block";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "none";
  aboutSection.style.display = "none";

  renderCarouselView(deck);
}

/** Displays the new-deck form and hides all other page sections. */
function renderNewDeckView() {
  pageEl.classList.remove("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "block";
  aboutSection.style.display = "none";
}

/** Displays the About section and hides all other page sections. */
function renderAboutView() {
  pageEl.classList.remove("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "none";
  aboutSection.style.display = "block";
}

/**
 * Creates a home-gallery list item for a deck and connects its controls.
 * @param {{_id: string, name: string, color: string, cards: Array}} deckData - The deck represented by the list item.
 * @returns {HTMLLIElement} The populated deck list item.
 */
function createDeckEl(deckData) {
  const cloneEl = deckTemplateEl.content.querySelector("li").cloneNode(true);

  const deckLinkEl = cloneEl.querySelector(".card__link");
  deckLinkEl.href = `#deck/${deckData._id}`;
  /** Sets this deck as current when its link is clicked. */
  deckLinkEl.addEventListener("click", () => {
    currentDeck = deckData;
  });

  cloneEl.querySelector(".card__title").textContent = deckData.name;

  const color = hexToString(deckData.color);
  cloneEl.querySelector(".card").classList.add(`card_color_${color}`);

  cloneEl.querySelector(".card__count").textContent =
    `${deckData.cards.length} Cards`;

  const deleteBtn = cloneEl.querySelector(".card__delete-btn");
  /** Deletes the deck remotely, then removes it from the UI and local cache. */
  deleteBtn.addEventListener("click", () => {
    deleteDeck(deckData._id)
      /** Updates the page and cache after the API confirms deletion. */
      .then(() => {
        cloneEl.remove();

        const deckIndex = fetchedDecks.findIndex(
          /** Finds the cached deck matching the one just deleted. */
          (deck) => deck._id === deckData._id,
        );

        if (deckIndex !== -1) {
          fetchedDecks.splice(deckIndex, 1);
        }
      })
      .catch(showError);
  });

  return cloneEl;
}

/** Renders a deck card at the beginning of the home gallery. */
function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  deckContainerEl.prepend(deckEl);
}

/** Renders a newly created deck card sent through the custom event. */
window.addEventListener("deck-created", (event) => {
  renderDeckEl(event.detail);
});

/** Selects and displays the view identified by the current URL hash. */
function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    pageContentEl.classList.remove("page__main-content_location_carousel");
    renderHomeView();
  } else if (hash === "about") {
    pageContentEl.classList.remove("page__main-content_location_carousel");
    renderAboutView();
  } else if (hash === "new-deck") {
    pageContentEl.classList.remove("page__main-content_location_carousel");
    disableSubmitBtn();
    renderNewDeckView();
  } else if (hash.startsWith("deck/")) {
    pageContentEl.classList.remove("page__main-content_location_carousel");
    const deck = getDeckByID(hash.split("/")[1]);

    if (deck) {
      renderDeckViewForDeck(deck);
    } else {
      renderNotFoundView();
    }
  } else if (hash.startsWith("carousel/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);

    if (deck) {
      pageContentEl.classList.add("page__main-content_location_carousel");
      renderCarouselViewForDeck(deck);
    } else {
      renderNotFoundView();
    }
  } else {
    pageContentEl.classList.remove("page__main-content_location_carousel");
    renderNotFoundView();
  }
}

/** Loads decks from the API before rendering the initial route. */
window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    /** Caches and renders every deck returned by the API. */
    .then((decks) => {
      fetchedDecks.push(...decks);
      decks.forEach(renderDeckEl);
    })
    .catch(showError)
    /** Applies the current route after deck loading has completed. */
    .finally(() => {
      router();
    });
});
window.addEventListener("hashchange", router);
