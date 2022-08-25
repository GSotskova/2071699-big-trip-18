import AbstractView from '../framework/view/abstract-view.js';

const createEmptyEverythingTemplate = () => (
  `<p class="trip-events__msg">
  Click New Event to create your first point
  </p>`
);

export default class EmptyEverythingView extends AbstractView {
  get template() {
    return createEmptyEverythingTemplate();
  }
}
