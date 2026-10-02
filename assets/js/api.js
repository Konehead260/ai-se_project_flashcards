const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
const headers = {
  "Content-Type": "application/json",
  Authorization: "01a0f472-fb6b-718a-a1a5-ff00a68064dc",
};

/**
 * Checks an API response and parses its JSON body when the request succeeds.
 * Rejects with an error message containing the HTTP status when it fails.
 * @param {Response} res - The response returned by fetch.
 * @returns {Promise<unknown>} The parsed response body.
 */
function processResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }

  return res.json();
}

/**
 * Retrieves all decks from the API.
 * @returns {Promise<unknown>} A promise resolving to the API's deck-list response.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Creates a deck through the API.
 * @param {object} deck - The deck data to send as JSON.
 * @returns {Promise<unknown>} A promise resolving to the API's created-deck response.
 */
function addDeck(deck) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify(deck),
  }).then(processResponse);
}

/**
 * Deletes a deck through the API.
 * @param {string} deckId - The ID of the deck to delete.
 * @returns {Promise<unknown>} A promise resolving to the API's delete response.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

export { getDecks, deleteDeck, addDeck };
