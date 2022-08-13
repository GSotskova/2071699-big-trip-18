import {createElement} from '../render.js';

const createItemTemplate = () => '<li class="trip-events__item"></li>';


export default class ItemView {
  getTemplate() {
    return createItemTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}


