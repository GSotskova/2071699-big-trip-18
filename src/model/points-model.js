import {generatePoint,generateDestination,generateOffer} from '../mock/point.js';
import {POINT_COUNT} from '../const.js';


export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, (v,i)=>generatePoint(i));
  getPoints = () => this.points;

  destinations = Array.from({length: POINT_COUNT}, (v,i)=>generateDestination(i));
  getDestinations = () => this.destinations;

  offers = Array.from({length: POINT_COUNT}, (v,i)=>generateOffer(i));
  getOffers = () => this.offers;
}
