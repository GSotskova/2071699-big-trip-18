import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import PointNewPresenter from './point-new-presenter.js';
import EmptyView from '../view/empty-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import {sortDuration, sortPrice, sortPointDefault} from '../utils/route.js';
import {getAllOffersWithType} from '../utils/point.js';
import {SortType, UpdateType, UserAction, FilterType} from '../constants.js';
import {filter} from '../utils/filter.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #routeComponent = new RouteView();

  #routeOffers = [];

  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #allDestinations = [];
  #noPointComponent = null;
  #filterType = FilterType.EVERYTHING;

  constructor(routeContainer, pointsModel, offersModel, destinationsModel, filterModel) {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#routeComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.DATE_TIME:
        filteredPoints.sort(sortDuration);
        break;
      case SortType.DATE_PRICE:
        filteredPoints.sort(sortPrice);
        break;
      default: filteredPoints.sort(sortPointDefault);
    }
    return filteredPoints;
  }

  init = () => {
    this.#routeOffers = getAllOffersWithType([...this.#offersModel.offersByType], [...this.#offersModel.allOffers]);
    this.#allDestinations = [...this.#destinationsModel.destinations];
    this.#renderRoute();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback, this.#allDestinations, this.#routeOffers);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.#allDestinations, this.#routeOffers);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#clearRoute({resetSortType: true});
        this.#renderRoute();
        break;
    }
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#routeContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point, allDestinations, allOffers) => {
    const pointPresenter = new PointPresenter(this.#routeComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, allDestinations, allOffers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points, allDestinations, allOffers) => {
    points.forEach((point) => this.#renderPoint(point, allDestinations, allOffers));
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointList = () => {
    const pointCount = this.points.length;
    const points = this.points.slice(0, pointCount);

    render(this.#routeComponent, this.#routeContainer);
    this.#renderPoints(points, this.#allDestinations, this.#routeOffers);
  };

  #renderMsgEmpty = () => {
    this.#noPointComponent = new EmptyView(this.#filterType);
    render(this.#noPointComponent, this.#routeComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearRoute = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderRoute = () => {
    const points = this.points;
    const pointCount = points.length;

    render(this.#routeComponent, this.#routeContainer);
    if (pointCount === 0) {
      this.#renderMsgEmpty();
      return;
    }
    this.#renderSort();
    this.#renderPoints(points.slice(0, pointCount), this.#allDestinations, this.#routeOffers);
  };
}
