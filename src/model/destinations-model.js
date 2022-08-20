import {generateDestination} from '../mock/point.js';
import {POINT_COUNT} from '../constants.js';


export default class DestinationsModel {
  #destinations = Array.from({length: POINT_COUNT}, (_v,i) => generateDestination(i + 1));

  //находим пункт назначения для конкретной точки
  getDestinations = (point) => this.#destinations.find((destination) => destination.id === point.destination);

}
