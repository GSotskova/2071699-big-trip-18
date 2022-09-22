import AbstractView from '../framework/view/abstract-view.js';

const createErrorMsgTemplate = () => (
  `<p class="trip-events__msg">
      Data loading error
  </p>`
);

export default class ErrorLoadingView extends AbstractView {
  get template() {
    return createErrorMsgTemplate();
  }
}
