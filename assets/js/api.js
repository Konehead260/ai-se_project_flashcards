const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
const headers = {
  "Content-Type": "application/json",
  Authorization: "01a0f472-fb6b-718a-a1a5-ff00a68064dc",
};

function processResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

export { getDecks, deleteDeck };
