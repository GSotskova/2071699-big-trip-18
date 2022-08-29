import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import {getdateDiff} from '../utils/route.js';

const createOfferTemplate = (selectedOffer) => {
  const {type, price} = selectedOffer;

  return (
    `<li class="event__offer">
        <span class="event__offer-title">${type}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
    </li>`
  );
};


const createPointTemplate = (point, destination, selectedOffers) => {
  const {price, dateFrom, dateTo, type, isFavorite} = point;
  const {name} = destination;
  const dateFormatDay = dayjs(dateFrom).format('MMM D');
  const timeFrom = dayjs(dateFrom).format('HH:mm');
  const timeTo = dayjs(dateTo).format('HH:mm');
  const durationTime = getdateDiff(dateFrom,dateTo);

  let offerTemplate = '';

  selectedOffers.forEach((el) => {
    offerTemplate += createOfferTemplate(el);
  });

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${dateFormatDay}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${name} </h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${timeTo}</time>
          </p>
          <p class="event__duration">${durationTime}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offerTemplate}
        </ul>
        <button class="event__favorite-btn event__favorite-btn--active" type="button">
          <span class="${isFavorite ? 'visually-hidden' : ''}">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};


export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #selectedOffers = [];

  constructor(point, destination, selectedOffers) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#selectedOffers = selectedOffers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#selectedOffers);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    const isFavoriteButton = this.element.querySelector('.event__favorite-btn');
    isFavoriteButton.addEventListener('click', this.#favoriteClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}


