import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TotalRouteView from '../view/total-route-view.js';
import {sortPointDefault} from '../utils/route.js';

export default class TotalRoutePresenter {
  #totalRouteContainer = null;
  #totalRouteComponent = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor(totalRouteContainer, pointsModel, destinationsModel, offersModel) {
    this.#totalRouteContainer = totalRouteContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);

  }

  get routePoints() {
    return this.#pointsModel.points.sort(sortPointDefault);
  }

  init = () => {
    const points = this.routePoints;
    if (points.length === 0) {
      return;
    }
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;
    const prevTotalComponent = this.#totalRouteComponent;
    this.#totalRouteComponent = new TotalRouteView(points, destinations, offers);

    if (prevTotalComponent === null) {
      render(this.#totalRouteComponent, this.#totalRouteContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#totalRouteComponent, prevTotalComponent);
    remove(prevTotalComponent);
  };


  #handleModelEvent = () => {
    this.init();
  };
}
