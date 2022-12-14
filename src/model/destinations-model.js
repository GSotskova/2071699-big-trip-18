import Observable from '../framework/observable.js';
import {UpdateType} from '../constants.js';


export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  init = async () => {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;

    } catch(err) {
      this.#destinations = [];
      throw new Error('Can\'t load data');
    } finally {

      if (this.#destinations.length === 0) {
        this._notify(UpdateType.ERROR);
      }
    }

    this._notify(UpdateType.INIT);
  };

  get destinations() {
    return this.#destinations;
  }
}
