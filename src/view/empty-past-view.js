import AbstractView from '../framework/view/abstract-view.js';

const createEmptyPastTemplate = () => (
  `<p class="trip-events__msg">
  There are no past events now
  </p>`
);

export default class EmptyPastView extends AbstractView {

  get template() {
    return createEmptyPastTemplate();
  }

}
