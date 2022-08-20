import {generateOffer} from '../mock/point.js';
import {TYPES} from '../constants.js';


export default class OffersModel {
  #allOffers = Array.from({length: TYPES.length}, (_v,i) => generateOffer(i + 1));

  get allOffers() {
    return this.#allOffers;
  }

  //получаем массив опций для конкретной точки маршрута
  getPointOffer = (point) => point.offers.map((offerId) => this.#allOffers.find((offer) => offer.id === offerId));

}
