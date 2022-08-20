import {createElement} from '../render.js';

const createRouteTemplate = () => '<ul class="trip-events__list"></ul>';

export default class RouteView {
  #element = null;
  get template() {
    return createRouteTemplate();
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
