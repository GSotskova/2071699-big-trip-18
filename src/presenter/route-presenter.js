import {render, RenderPosition, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorLoadingView from '../view/error-loading-view.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import {sortDuration, sortPrice, sortPointDefault} from '../utils/route.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType, TimeLimit} from '../constants.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
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

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(routeContainer, pointsModel, destinationsModel, offersModel, filterModel) {
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

  get offers() {
    const offers = this.#offersModel.offers;
    return offers;
  }

  get destinations() {
    const destinations = this.#destinationsModel.destinations;
    return destinations;
  }

  init = () => {
    this.#renderRoute();
  };

  createPoint = (callback) => {
    const offers = this.offers;
    const destinations = this.destinations;
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback, destinations, offers);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    const offers = this.offers;
    const destinations = this.destinations;
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, destinations, offers);
        break;
      case UpdateType.MINOR:
        this.#clearRoute();
        this.#renderRoute();
        break;
      case UpdateType.MAJOR:
        this.#clearRoute({resetSortType: true});
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

  #renderPoint = (point, destinations, offers) => {
    const pointPresenter = new PointPresenter(this.#routeComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, destinations, offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points, destinations, offers) => {
    points.forEach((point) => this.#renderPoint(point, destinations, offers));
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

    if (pointCount === 0) {
      this.#renderMsgEmpty();
      return;
    }

    this.#renderSort();
    const offers = this.offers;
    const destinations = this.destinations;
    this.#renderPoints(points.slice(0, pointCount), destinations, offers);
  };
}
