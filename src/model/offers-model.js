import Observable from '../framework/observable.js';
import {UpdateType} from '../constants.js';


export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch(err) {
      this.#offers = [];
      throw new Error('Can\'t load data');
    } finally {

      if (this.#offers.length === 0) {
        this._notify(UpdateType.ERROR);
      }
    }

    this._notify(UpdateType.INIT);
  };

  get offers () {
    return this.#offers;
  }

}
