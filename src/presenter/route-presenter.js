import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import ItemView from '../view/item-view.js';
import NewPointView from '../view/new-point-view.js';
import EmptyEverythingView from '../view/empty-everything-view.js';
import EmptyPastView from '../view/empty-past-view.js';
import EmptyFutureView from '../view/empty-future-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import {updatePoint} from '../utils/common.js';
import {sortDuration, sortPrice, sortPointDefault} from '../utils/route.js';
import {SortType} from '../constants.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #routeComponent = new RouteView();
  #itemNewPointComponent = new ItemView();

  #routePoints = [];
  #routeOffers = [];

  #currentSortType = SortType.DEFAULT;
  #sourcedRoutePoints = [];
  #sortComponent = new SortView(this.#currentSortType);

  #newPointComponent = new NewPointView();

  #pointPresenter = new Map();


  init = (routeContainer, pointsModel, offersModel, destinationsModel, filterModel) => {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#routePoints = [...this.#pointsModel.points].sort(sortPointDefault);
    this.#routeOffers = [...this.#offersModel.allOffers];

    this.#sourcedRoutePoints = [...this.#pointsModel.points].sort(sortPointDefault);

    this.#renderRoute();

  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };


  #handlePointChange = (updatedPoint) => {
    this.#routePoints = updatePoint(this.#routePoints, updatedPoint);

    const destination = this.#destinationsModel.getDestinations(updatedPoint);
    const pointOffers = [...this.#offersModel.getPointOffer(updatedPoint)];

    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, destination, this.#routeOffers, pointOffers);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DATE_TIME:
        this.#routePoints.sort(sortDuration);
        break;
      case SortType.DATE_PRICE:
        this.#routePoints.sort(sortPrice);
        break;
      default:
        this.#routePoints = [...this.#sourcedRoutePoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    /*Перерисовываем компонент сортировки, т.к. меняется выбранный пункт меню и нужно обновить свойство checked */
    this.#clearSort();
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#renderSort();
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#routeContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #clearSort = () => {
    remove(this.#sortComponent);
  };

  #renderNewPoint = () => {
    render(this.#itemNewPointComponent, this.#routeComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#newPointComponent, this.#itemNewPointComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point, destinationModel, allOffers, offersModel) => {
    const destination = destinationModel.getDestinations(point);
    const pointOffers = [...offersModel.getPointOffer(point)];

    const pointPresenter = new PointPresenter(this.#routeComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, destination, allOffers, pointOffers);
    this.#pointPresenter.set(point.id, pointPresenter);

  };

  #renderPoints = (from, to, destinationModel, allOffers, offersModel) => {
    this.#routePoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point, destinationModel, allOffers, offersModel));
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointList = () => {
    render(this.#routeComponent, this.#routeContainer);
    this.#renderPoints(0, this.#routePoints.length, this.#destinationsModel, this.#routeOffers, this.#offersModel);
  };

  #renderMsgEmpty = (filterModel) => {
    const withoutPointComponent = new EmptyEverythingView();
    const withoutPointPastComponent = new EmptyPastView();
    const withoutPointFutureComponent = new EmptyFutureView();

    render(withoutPointComponent, this.#routeContainer);//изначально выводим сообщение для всех точек маршрута

    //в зависимости от выбранного фильтра меняем сообщение
    const onReplaceMsgOfEmpty = (filterValue) => {
      switch (filterValue) {
        case 'everything':
          render(withoutPointComponent, this.#routeContainer);
          break;
        case 'future':
          render(withoutPointPastComponent, this.#routeContainer);
          break;
        case 'past':
          render(withoutPointFutureComponent, this.#routeContainer);
          break;
      }

    };

    filterModel.setEmptyEverythingMsg((evt) => onReplaceMsgOfEmpty(evt.target.value));
  };


  #renderRoute = () => {
    if (this.#routePoints.length === 0) {
      this.#renderMsgEmpty(this.#filterModel);
      return;
    }
    this.#renderSort();
    this.#renderPointList();

  };
}
