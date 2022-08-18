import {generatePoint, generateDestination, generateOffer} from '../mock/point.js';
import {POINT_COUNT} from '../constants.js';


export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, (v,i)=>generatePoint(i + 1));
  getPoints = () => this.points;

  destinations = Array.from({length: POINT_COUNT}, (v,i)=>generateDestination(i + 1));
  getDestinations = () => this.destinations;

  offers = Array.from({length: POINT_COUNT}, (v,i)=>generateOffer(i + 1));
  getOffers = () => this.offers;
}
