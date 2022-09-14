import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import {getDestinationById, getDestinationsNamesList, getDestinationIdByName} from '../utils/point.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createOfferEditTemplate = (offer, selectedOffersIds) => {

  const {id, price, title} = offer;
  let isChecked = '';
  if (selectedOffersIds.includes(id)) {
    isChecked = 'checked';
  }

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event__offer" value="${title}" ${isChecked}>
      <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createListDestinationsTmpl = (nameDestination) => `<option value="${nameDestination}"></option>`;

const createPhotoTemplate = (photosrc) => (
  `<div class="event__photos-container">
     <div class="event__photos-tape">
      <img class="event__photo" src="${photosrc}" alt="Event photo">
     </div>
   </div>`
);

const createDestinationTemplate = (description, photoDestination) => (
  `<section class="event__section  event__section--destination">
   <h3 class="event__section-title  event__section-title--destination">Destination</h3>
   <p class="event__destination-description">${description}</p>
   ${photoDestination}
</section>`
);


const createEditPointTemplate = (data, destinations, allOffers, typeFormName) => {
  const {price, newDateFrom, newDateTo, newDestinationId, newSelectedOffersIds, newType} = data;
  const date1 = dayjs(newDateFrom).format('DD/MM/YY HH:mm');
  const date2 = dayjs(newDateTo).format('DD/MM/YY HH:mm');
  let offerEditTemplate = '';
  let photoDestination = '';
  let destinationsListTemplate = '';
  let destinationElement = '';
  const destinationsNamesList = getDestinationsNamesList(destinations);
  destinationsNamesList.forEach((nameDestination) => {
    destinationsListTemplate += createListDestinationsTmpl(nameDestination);
  });

  let currentDestination = {};
  if (typeof newDestinationId === 'number' && newDestinationId > 0) {

    currentDestination = getDestinationById(newDestinationId, destinations);
    photoDestination = createPhotoTemplate(currentDestination.pictures[0].src);
    destinationElement = createDestinationTemplate(currentDestination.description, photoDestination);
  }

  if (newType) {
    allOffers.forEach((el) => {
      if (el.type.toLowerCase() === newType.toLowerCase()){
        offerEditTemplate += createOfferEditTemplate(el, newSelectedOffersIds);
      }
    });
  }


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
       <header class="event__header">
         <div class="event__type-wrapper">
           <label class="event__type  event__type-btn" for="event-type-toggle-1">
             <span class="visually-hidden">Choose event type</span>
             <img class="event__type-icon" width="17" height="17" src="img/icons/${newType}.png" alt="Event type icon">
           </label>
           <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

           <div class="event__type-list">
             <fieldset class="event__type-group">
               <legend class="visually-hidden">Event type</legend>

               <div class="event__type-item">
                 <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${newType === 'taxi' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
               </div>

               <div class="event__type-item">
                 <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${newType === 'bus' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
               </div>

               <div class="event__type-item">
                 <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${newType === 'train' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
               </div>

               <div class="event__type-item">
                 <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${newType === 'ship' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
               </div>

               <div class="event__type-item">
                 <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${newType === 'drive' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
               </div>

               <div class="event__type-item">
                 <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${newType === 'flight' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
               </div>

               <div class="event__type-item">
                 <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${newType === 'check-in' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
               </div>

               <div class="event__type-item">
                 <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${newType === 'sightseeing' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
               </div>

               <div class="event__type-item">
                 <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${newType === 'restaurant' ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
               </div>
             </fieldset>
           </div>
          </div>

         <div class="event__field-group  event__field-group--destination">
           <label
             class="event__label  event__type-output"
             for="event-destination-1"
           >
             ${newType}
           </label>
           <input
             class="event__input  event__input--destination"
             id="event-destination-1"
             type="text"
             name="event-destination"
             value="${currentDestination.name ? currentDestination.name : ''}"
             list="destination-list-1"
           >
           <datalist id="destination-list-1">
            ${destinationsListTemplate}
           </datalist>
         </div>

         <div class="event__field-group  event__field-group--time">
           <label class="visually-hidden" for="event-start-time-1">From</label>
           <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date1}">
           &mdash;
           <label class="visually-hidden" for="event-end-time-1">To</label>
           <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${date2}">
         </div>

         <div class="event__field-group  event__field-group--price">
           <label class="event__label" for="event-price-1">
             <span class="visually-hidden">Price</span>
             &euro;
           </label>
           <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
         </div>

         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
         <button class="event__reset-btn" type="reset">
           ${typeFormName === 'Edit' ? 'Delete' : 'Cancel'}
         </button>

           ${typeFormName === 'Edit'
      ? `<button class="event__rollup-btn   type="button">
          <span class="visually-hidden">Open event</span>
         </button>`
      : ''}

       </header>
       <section class="event__details">
         <section class="event__section  event__section--offers">
           <h3 class="event__section-title  event__section-title--offers">Offers</h3>

           <div class="event__available-offers">
           ${offerEditTemplate}
           </div>
         </section>

           ${destinationElement}
       </section>
     </form>
    </li>`
  );
};


export default class EditPointView extends AbstractStatefulView {

  #destinations = null;
  #allOffers = null;
  #typeFormName = null;
  #newDateFrompicker = null;
  #newDateTopicker = null;

  constructor(point, destinations, allOffers, typeFormName) {
    super();
    this._state = EditPointView.parsePointToState(point, destinations);
    this.#destinations = destinations;
    this.#allOffers = allOffers;
    this.#typeFormName = typeFormName;
    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#allOffers, this.#typeFormName);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#newDateFrompicker) {
      this.#newDateFrompicker.destroy();
      this.#newDateFrompicker = null;
    }
    if (this.#newDateTopicker) {
      this.#newDateTopicker.destroy();
      this.#newDateTopicker = null;
    }
  };

  reset = (point, destinations) => {
    this.updateElement(
      EditPointView.parsePointToState(point, destinations)
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      newDateFrom: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      newDateTo: userDate
    });
  };

  #setDatepicker = () => {
    this.#newDateFrompicker = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        enableTime: true,
        defaultDate: Date.parse(this._state.newDateFrom),
        dateFormat: 'd/m/y H:i',
        onChange: this.#dateFromChangeHandler,
      });

    this.#newDateTopicker = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        enableTime: true,
        defaultDate: Date.parse(this._state.newDateTo),
        minDate: Date.parse(this._state.newDateFrom),
        dateFormat: 'd/m/y H:i',
        onChange: this.#dateToChangeHandler,
      },
    );
  };


  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setClickResetHandler(this._callback.click);
    this.setClickRollUpHandler(this._callback.click);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseStateToPoint(this._state));
  };


  setClickResetHandler = (callback) => {
    this._callback.click = callback;
    const resetButton = this.element.querySelector('.event__reset-btn');
    resetButton.addEventListener('click', this.#clickHandler);
  };

  setClickRollUpHandler = (callback) => {
    if (this.#typeFormName === 'New') {
      return;
    }
    this._callback.click = callback;
    const rollUpButton = this.element.querySelector('.event__rollup-btn');
    rollUpButton.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.matches('input[name=event-destination]')) {
      return;
    }
    this.updateElement({
      newDestinationId: evt.target.value ? getDestinationIdByName(evt.target.value, this.#destinations) : ' '
    });
  };

  #typeOfferInputHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.matches('input[name=event-type]')) {
      return;
    }
    this.updateElement({
      newType: evt.target.value,
      newSelectedOffersIds: [],
    });
  };

  #offerCheckHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.matches('input[name=event__offer]')) {
      return;
    }
    const offerIndex = this._state.newSelectedOffersIds.indexOf(Number(evt.target.id));
    this.updateElement({
      newSelectedOffersIds: offerIndex < 0
        ? [...this._state.newSelectedOffersIds, Number(evt.target.id)]
        : [...this._state.newSelectedOffersIds.slice(0,offerIndex),...this._state.newSelectedOffersIds.slice(offerIndex + 1)]
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__input').addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeOfferInputHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerCheckHandler);
  };

  static parsePointToState = (point) => ({
    ...point,
    newDestinationId: point.destination,
    newType: point.type,
    newSelectedOffersIds: point.offers,
    newDateFrom: point.dateFrom,
    newDateTo: point.dateTo
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    if (point.newDestinationId) {
      delete point.newDestinationId;
    }
    if (point.newType) {
      delete point.newType;
    }
    if (point.newSelectedOffersIds) {
      delete point.newSelectedOffersIds;
    }
    if (point.newDateFrom) {
      delete point.newDateFrom;
    }
    if (point.newDateTo) {
      delete point.newDateTo;
    }
    return point;
  };
}


