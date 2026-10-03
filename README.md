# Flash Cards

A flashcard app built as a project for TripleTen's AI-Assisted Software
Engineering program. Create decks, review their cards, and practice with a
carousel.

## Features

- Browse decks loaded from the Flash Cards API
- View individual decks and flip flashcards to reveal answers
- Practice a deck using previous, next, and flip controls
- Create decks by entering JSON and choosing a deck color
- Validate deck names, card arrays, JSON syntax, and optional JSON colors
- Delete decks from the gallery
- About page and responsive layouts for desktop and mobile

## Technologies

- HTML5
- CSS3 with BEM naming and responsive media queries
- Vanilla JavaScript with ES modules and the Fetch API
- Flash Cards API
- GitHub Pages

## Using the App

Open the [deployed site](https://Konehead260.github.io/ai-se_project_flashcards).
Select a deck to view its cards, then choose **Practice** to open the carousel.
Use the arrow buttons to move between cards and the flip button to switch
between each question and answer.

To create a deck, choose **New Deck**, select a color, and enter JSON in this
format:

```json
{
  "name": "Command Line",
  "cards": [
    {
      "question": "What command prints the current working directory?",
      "answer": "pwd"
    }
  ]
}
```

The `name` must be a string between 2 and 80 characters, and `cards` must be an
array of question-and-answer objects. A JSON `color` field is optional; when
provided, it must match the color selected in the form.

## Deployed Site

[Live site](https://Konehead260.github.io/ai-se_project_flashcards)

## Local Development

Serve the project directory with a local HTTP server, then open `index.html`
through that server. The app uses JavaScript modules and makes requests to the
Flash Cards API, so it needs a browser connection to the internet and should
not be opened directly with a `file://` URL.

## Project Pitch Videos

- [ Project pitch video #1 ](https://drive.google.com/file/d/1s-JAqZaISSzOwYE4eewc6Unsq6xXhqkL/view?usp=drive_link)

[ Project pitch video #2 ](https://drive.google.com/file/d/1_qf2qChwBAbaKbsCmxh1TShCHzb23c7f/view?usp=drive_link)
