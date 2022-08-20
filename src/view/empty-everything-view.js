import {createElement} from '../render.js';

const createEmptyEverythingTemplate = () => (
  `<p class="trip-events__msg">
  Click New Event to create your first point
  </p>`
);

export default class EmptyEverythingView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEmptyEverythingTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
