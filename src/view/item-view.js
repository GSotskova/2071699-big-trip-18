import {createElement} from '../render.js';

const createItemTemplate = () => '<li class="trip-events__item"></li>';


export default class ItemView {
  #element = null;

  get template() {
    return createItemTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}


