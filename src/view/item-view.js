import AbstractView from '../framework/view/abstract-view.js';

const createItemTemplate = () => '<li class="trip-events__item"></li>';


export default class ItemView extends AbstractView {

  get template() {
    return createItemTemplate();
  }
}


