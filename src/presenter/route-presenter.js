import {render, RenderPosition, remove} from '../framework/render.js';
import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorLoadingView from '../view/error-loading-view.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import {sortDuration, sortPrice, sortPointDefault} from '../utils/route.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../constants.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #routeComponent = new RouteView();
  #loadingComponent = new LoadingView();
  #errLoadingComponent = new ErrorLoadingView();

  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #noPointComponent = null;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(routeContainer, pointsModel, filterModel) {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
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

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init = () => {
    this.#renderRoute();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback, this.destinations, this.offers);
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
        this.#pointPresenter.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearRoute();
        this.#renderRoute();
        break;
      case UpdateType.MAJOR:
        this.#clearRoute({resetSortType: false});
        this.#renderRoute();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderRoute();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderErrLoading();
        break;
    }
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearRoute();
    this.#renderRoute();
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

  #renderMsgEmpty = () => {
    this.#noPointComponent = new EmptyView(this.#filterType);
    render(this.#noPointComponent, this.#routeComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearRoute = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#routeComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderErrLoading = () => {
    render(this.#errLoadingComponent, this.#routeComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderRoute = () => {
    render(this.#routeComponent, this.#routeContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const points = this.points;
    const pointCount = points.length;
    const offers = this.offers;
    const destinations = this.destinations;

    if (pointCount === 0) {
      this.#renderMsgEmpty();
      return;
    }
    this.#renderSort();
    this.#renderPoints(points.slice(0, pointCount), destinations, offers);
  };
}
