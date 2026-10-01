import { getDeckByID, fetchedDecks } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { disableSubmitBtn } from "./new-deck-view.js";
import { getDecks } from "./api.js";
import { showError } from "./new-deck-view.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const newDeckSection = document.querySelector("#new-deck");

const pageEl = document.querySelector(".page");
const pageContentEl = document.querySelector(".page__main-content");
const deckTemplateEl = document.querySelector("#card-template");
const deckContainerEl = homeSection.querySelector(".gallery__list");
const practiceBtn = deckViewSection.querySelector(".gallery__practice-btn");
const homeNewDeckBtn = document.querySelector("#home .gallery__new-card-btn");

let currentDeck = null;

practiceBtn.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `carousel/${currentDeck._id}`;
  }
});

homeNewDeckBtn.addEventListener("click", () => {
  window.location.hash = "new-deck";
});

function renderHomeView() {
  pageEl.classList.remove("page_no-mobile-bar");
  homeSection.style.display = "block";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "none";
}

function renderNotFoundView() {
  pageEl.classList.add("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
  newDeckSection.style.display = "none";
}

function renderDeckViewForDeck(deck) {
  currentDeck = deck;
  pageEl.classList.remove("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "none";

  renderDeckView(deck);
}

function renderCarouselViewForDeck(deck) {
  pageEl.classList.add("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "block";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "none";

  renderCarouselView(deck);
}

function renderNewDeckView() {
  pageEl.classList.remove("page_no-mobile-bar");
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckSection.style.display = "block";
}

function createDeckEl(deckData) {
  const cloneEl = deckTemplateEl.content.querySelector("li").cloneNode(true);

  const deckLinkEl = cloneEl.querySelector(".card__link");
  deckLinkEl.href = `#deck/${deckData._id}`;
  deckLinkEl.addEventListener("click", () => {
    currentDeck = deckData;
  });

  cloneEl.querySelector(".card__title").textContent = deckData.name;

  const color = hexToString(deckData.color);
  cloneEl.querySelector(".card").classList.add(`card_color_${color}`);

  cloneEl.querySelector(".card__count").textContent =
    `${deckData.cards.length} Cards`;

  const deleteBtn = cloneEl.querySelector(".card__delete-btn");
  deleteBtn.addEventListener("click", () => {
    cloneEl.remove();
  });

  return cloneEl;
}

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  deckContainerEl.prepend(deckEl);
}

function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    pageContentEl.classList.remove("page__main-content_location_carousel");
    renderHomeView();
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

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      decks.forEach(renderDeckEl);
    })
    .catch(showError)
    .finally(() => {
      router();
    });
});
window.addEventListener("hashchange", router);
