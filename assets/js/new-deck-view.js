import { decks, getDeckByID } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const newDeckForm = document.querySelector(".new-deck-view__form");
const newDeckSubmitBtn = document.querySelector(".new-deck-view__submit-btn");
const newDeckTextarea = document.querySelector(".new-deck-view__textarea");
const errorModal = document.querySelector("#error-modal");
const modalCloseBtn = errorModal.querySelector(".modal__close");
const modalErrorEl = errorModal.querySelector(".modal__error");
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

function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function showError(message) {
  modalErrorEl.textContent = message;
  return;
}

modalCloseBtn.addEventListener("click", function () {
  errorModal.classList.remove("modal_visible");
});

newDeckForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const deckData = new FormData(newDeckForm);
  const values = Object.fromEntries(deckData.entries());
  const jsonData = parseJSON(values.jsonText);
  const normalizedColor = normalizeColor(values.color);
  let isValid = true;

  if (jsonData === null) {
    isValid = false;
    showError("JSON parsing failed");
    errorModal.classList.add("modal_visible");
    return;
  }

  const name = validateName(jsonData.name);
  if (name === null) {
    isValid = false;
    showError("name must be a string between 2 and 80 characters");
    errorModal.classList.add("modal_visible");
    return;
  }

  const deckId = `${slugify(jsonData.name)}-${Date.now()}`;

  if (!Array.isArray(jsonData.cards)) {
    isValid = false;
    showError("cards must be an array");
    errorModal.classList.add("modal_visible");
  }

  const selectedColor = String(values.color ?? "").toLowerCase();

  if (typeof jsonData.color === "string") {
    const jsonColor = jsonData.color.toLowerCase();

    if (jsonColor !== selectedColor) {
      showError(
        `The JSON color (${jsonColor}) does not match the selected color (${selectedColor}).`,
      );
      isValid = false;
      errorModal.classList.add("modal_visible");
      return;
    }
  }

  if (!isValid) {
    return;
  }

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
