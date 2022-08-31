import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../constants.js';

const createSortTemplate = (sortTypeChecked) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
     <div class="trip-sort__item  trip-sort__item--day">
       <input
         id="sort-day"
         class="trip-sort__input visually-hidden"
         type="radio"
         name="trip-sort"
         value="sort-day"
         data-sort-type="${SortType.DEFAULT}"
         ${sortTypeChecked === 'Day' ? 'checked' : ''}
       >
       <label class="trip-sort__btn" for="sort-day">Day</label>
     </div>

     <div class="trip-sort__item  trip-sort__item--event">
       <input
         id="sort-event"
         class="trip-sort__input  visually-hidden"
         type="radio"
         name="trip-sort"
         value="sort-event"
         data-sort-type="${SortType.DATE_EVENT}"
         ${sortTypeChecked === 'Event' ? 'checked' : ''}
         disabled
       >
       <label class="trip-sort__btn" for="sort-event">Event</label>
     </div>

     <div class="trip-sort__item  trip-sort__item--time">
       <input
         id="sort-time"
         class="trip-sort__input  visually-hidden"
         type="radio"
         name="trip-sort"
         value="sort-time"
         data-sort-type="${SortType.DATE_TIME}"
         ${sortTypeChecked === 'Time' ? 'checked' : ''}
       >
       <label class="trip-sort__btn" for="sort-time">Time</label>
     </div>

     <div class="trip-sort__item  trip-sort__item--price">
       <input
         id="sort-price"
         class="trip-sort__input  visually-hidden"
         type="radio"
         name="trip-sort"
         value="sort-price"
         data-sort-type="${SortType.DATE_PRICE}"
         ${sortTypeChecked === 'Price' ? 'checked' : ''}
       >
       <label class="trip-sort__btn" for="sort-price">Price</label>
     </div>

     <div class="trip-sort__item  trip-sort__item--offer">
       <input
         id="sort-offer"
         class="trip-sort__input  visually-hidden"
         type="radio"
         name="trip-sort"
         value="sort-offer"
         data-sort-type="${SortType.DATE_OFFERS}"
         ${sortTypeChecked === 'Offers' ? 'checked' : ''}
         disabled
       >
       <label class="trip-sort__btn" for="sort-offer">Offers</label>
     </div>
   </form>`
);


export default class SortView extends AbstractView {
  #sortTypeChecked = null;

  constructor(sortTypeChecked){
    super();
    this.#sortTypeChecked = sortTypeChecked;
  }

  get template() {
    return createSortTemplate(this.#sortTypeChecked);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.matches('input[name=trip-sort]')) {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}


