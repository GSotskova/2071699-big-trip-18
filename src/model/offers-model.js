import {generateOffer, generateOffersByType} from '../mock/point.js';
import {TYPES} from '../constants.js';


export default class OffersModel {
  #allOffers = Array.from({length: TYPES.length * 5}, (_v,i) => generateOffer(i + 1));
  #offersByType = Array.from({length: TYPES.length}, (_v,i) => generateOffersByType(i + 1));

  get allOffers() {
    return this.#allOffers;
  }

  get offersByType() {
    return this.#offersByType;
  }

}
