import Observable from '../framework/observable.js';
import {generateOffer, generateOffersByType} from '../mock/point.js';
import {TYPES, COUNT_OFFERS_TYPE} from '../constants.js';


export default class OffersModel extends Observable {
  #allOffers = Array.from({length: TYPES.length * COUNT_OFFERS_TYPE}, (_v,i) => generateOffer(i + 1));
  #offersByType = Array.from({length: TYPES.length}, (_v,i) => generateOffersByType(i + 1));

  get allOffers() {
    return this.#allOffers;
  }

  get offersByType() {
    return this.#offersByType;
  }

}
