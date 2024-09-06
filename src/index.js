import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1 } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

// Messages which can be used to update the model
const MSGS = {
  ADD_FLASHCARD: "ADD_FLASHCARD",
  DELETE_FLASHCARD: "DELETE_FLASHCARD",
  UPDATE_FLASHCARD: "UPDATE_FLASHCARD",
  UPDATE_QUESTION: "UPDATE_QUESTION",
  UPDATE_ANSWER: "UPDATE_ANSWER",
  EDIT_FLASHCARD: "EDIT_FLASHCARD",
  RATE_FLASHCARD: "RATE_FLASHCARD",
  SHOW_FLASHCARD: "SHOW_FLASHCARD"
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    h1({ className: "text-2xl" }, `${model.Flashcard}`),
    div({ className: "flex gap-4" }, [
      button({ className: btnStyle, onclick: () => dispatch(MSGS.ADD_FLASHCARD) }, "+ Add Flashcard"),
    ]),
  ]);
}


// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (msg) {
    case MSGS.ADD_FLASHCARD:
      const newFlashcard = { Flashcard: model.Flashcard, Question: model.Question, Answer: model.Answer };
      const updatedQuestion = [...model.Question, newFlashcard];
      const updatedAnswer = [...model.Answer, newFlashcard];
      return { ...model, Flashcard: updatedQuestion, updatedAnswer,  Question: "", Answer: "" };

    case MSGS.DELETE_FLASHCARD:
      const filteredFlashcard = model.Flashcard.filter((_, idx) => idx !== msg.index);
      return { ...model, Flashcard: filteredFlashcard };
    
      case MSGS.UPDATE_FLASHCARD:
        return { ...model, Flashcard: msg.Question, Flashcard: msg.Answer };
  }
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}


// The initial model when the app starts
const initModel = {
  Flashcard: "",
  Answer: "",
  Question: ""
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);
