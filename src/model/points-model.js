import {generatePoint} from '../mock/point.js';
import {POINT_COUNT} from '../constants.js';


export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, (_v,i) => generatePoint(i + 1));
  get points() {
    return this.#points;
  }
}
