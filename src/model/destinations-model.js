import {generateDestination} from '../mock/point.js';
import {POINT_COUNT} from '../constants.js';


export default class DestinationsModel {
  #destinations = Array.from({length: POINT_COUNT}, (_v,i) => generateDestination(i + 1));

  get destinations() {
    return this.#destinations;
  }

}
