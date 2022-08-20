import {createElement} from '../render.js';

const createEmptyFutureTemplate = () => (
  `<p class="trip-events__msg">
  There are no future events now
  </p>`
);

export default class EmptyFutureView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEmptyFutureTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
