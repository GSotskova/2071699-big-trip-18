import AbstractView from '../framework/view/abstract-view.js';
import {getDestinationNameById, getSummElementsArray, getPricePointOffers} from '../utils/point.js';
import dayjs from 'dayjs';

const getTotalCoast = (points, allOffers) => {

  const coastOffersPoint = points.map((point) => {
    const offersPointPrices = getPricePointOffers(point.offers, point.type, allOffers);
    return getSummElementsArray(offersPointPrices);
  });

  const totalCoastOffersPoints = getSummElementsArray(coastOffersPoint);

  const totalCoastPoints = getSummElementsArray(points.map((point) => point.price));

  return totalCoastOffersPoints + totalCoastPoints;
};

const createTotalRouteTemplate = (points, destinations, allOffers) => {
  let pointsList = '';
  const pointsCount = points.length;

  const destinationsIds = points.map((point) => point.destination);
  const destinationsOneIds = destinationsIds.filter((item, index) => destinationsIds.indexOf(item) === index || item !== destinationsIds[index - 1]);

  const pointsWithoutRepeatCount = destinationsOneIds.length;

  if (pointsWithoutRepeatCount > 3 ) {
    pointsList = `${getDestinationNameById(points[0].destination, destinations)
    } – ... – ${
      getDestinationNameById(points[pointsCount - 1].destination, destinations)}`;

  } else {
    pointsList = destinationsOneIds.map((destination) => getDestinationNameById(destination, destinations)).join(' – ');
  }

  const totalCoast = getTotalCoast(points, allOffers);
  const dateStartRoute = dayjs(points[0].dateFrom).format('DD MMM');
  const dateFinishRoute = dayjs(points[pointsCount - 1].dateTo).format('DD MMM');

  return (
    `<section class="trip-main__trip-info  trip-info">
       <div class="trip-info__main">
         <h1 class="trip-info__title">${pointsList}</h1>

         <p class="trip-info__dates">${dateStartRoute}&nbsp;—&nbsp;${dateFinishRoute}</p>
       </div>

       <p class="trip-info__cost">
         Total: €&nbsp;<span class="trip-info__cost-value">${totalCoast}</span>
       </p>
     </section>`);
};


export default class TotalRouteView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = [];

  constructor(points, destinations, offers) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTotalRouteTemplate(this.#points, this.#destinations, this.#offers);
  }
}
