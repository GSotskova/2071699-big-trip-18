import AbstractView from '../framework/view/abstract-view.js';

const createEmptyFutureTemplate = () => (
  `<p class="trip-events__msg">
  There are no future events now
  </p>`
);

export default class EmptyFutureView extends AbstractView {
  get template() {
    return createEmptyFutureTemplate();
  }
}
