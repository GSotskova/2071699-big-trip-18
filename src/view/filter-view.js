import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);


export default class FilterView extends AbstractView {


  get template() {
    return createFilterTemplate();
  }

  setEmptyEverythingMsg = (callback) => {
    this._callback.change = callback;
    this.element.querySelectorAll('.trip-filters__filter-input').forEach(() => addEventListener('change', this.#clickEverythingButton));
  };

  #clickEverythingButton = (evt) => {
    evt.preventDefault();
    document.querySelector('.trip-events__msg').remove();
    this._callback.change(evt);
  };
}
