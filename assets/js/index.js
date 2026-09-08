import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");

const pageContentEl = document.querySelector(".page__main-content");

function renderHomeView() {
  homeSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
}

function renderCarouselViewForDeck(deck) {
  homeSection.style.display = "none";
  carouselSection.style.display = "block";
  notFoundSection.style.display = "none";

  renderCarouselView(deck);
}

const deckTemplateEl = document.querySelector("#card-template");
const deckContainerEl = document.querySelector(".decks__list");

function createDeckEl(deckData) {
  const cloneEl = deckTemplateEl.content.querySelector("li").cloneNode(true);

  const deckLinkEl = cloneEl.querySelector(".deck__link");
  deckLinkEl.href = `#carousel/${deckData.id}`;

  const deckTitleEl = cloneEl.querySelector(".deck__title");
  deckTitleEl.textContent = deckData.name;

  const color = hexToString(deckData.color);
  const deckCardEl = cloneEl.querySelector(".deck"); // Gets the deck card div
  deckCardEl.classList.add(`deck_color_${color}`);

  const deckCountEl = cloneEl.querySelector(".deck__count");
  deckCountEl.innerText = `${deckData.cards.length} Cards`;

  const deleteBtn = cloneEl.querySelector(".deck__delete-btn");
  deleteBtn.addEventListener("click", () => {
    cloneEl.remove();
  });

  return cloneEl;
}

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  deckContainerEl.prepend(deckEl);
}

decks.forEach(renderDeckEl);

function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    pageContentEl.classList.remove("page__main-content_location_carousel");
    renderHomeView();
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

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
