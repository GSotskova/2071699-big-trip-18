import {createElement} from '../render.js';

const createEmptyPastTemplate = () => (
  `<p class="trip-events__msg">
  There are no past events now
  </p>`
);

export default class EmptyPastView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEmptyPastTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
