import { decks, getDeckByID } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const newDeckForm = document.querySelector(".new-deck-view__form");
const newDeckSubmitBtn = document.querySelector(".new-deck-view__submit-btn");
const newDeckTextarea = document.querySelector(".new-deck-view__textarea");

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

function disableSubmitBtn() {
  newDeckSubmitBtn.disabled = false;
}

newDeckForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const deckData = new FormData(newDeckForm);
  const values = Object.fromEntries(deckData.entries());
  const jsonData = JSON.parse(values.jsonArray);
  const normalizedColor = normalizeColor(values.color);
  const deckId = `${slugify(jsonData.name)}-${Date.now()}`;

  // Declare a deck object variable
  const deck = {
    id: deckId,
    color: normalizedColor,
    cards: jsonData.cards,
    name: jsonData.name,
  };

  decks.push(deck);
  window.location.hash = "deck/" + deck.id;
});

export { disableSubmitBtn };
