import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import EmptyEverythingView from '../view/empty-everything-view.js';
import EmptyPastView from '../view/empty-past-view.js';
import EmptyFutureView from '../view/empty-future-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import {updatePoint} from '../utils/common.js';
import {sortDuration, sortPrice, sortPointDefault} from '../utils/route.js';
import {getAllOfferType} from '../utils/point.js';
import {SortType, pointEmpty} from '../constants.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #addPointButton = null;

  #routeComponent = new RouteView();

  #routePoints = [];
  #routeOffers = [];

  #currentSortType = SortType.DEFAULT;
  #defaultSortType = SortType.DEFAULT;
  #sourcedRoutePoints = [];
  #sortComponent = new SortView(this.#currentSortType);

  #pointPresenter = new Map();

  #allDestinations = [];
  #pointEmpty = pointEmpty;
  #pointNewComponent = null;
  #typeFormElement = 'New'; //т.к.используется одна View  для новой точки маршрута и для формы редактирования добавляем признак для формы "New"/"Edit"

  init = (routeContainer, pointsModel, offersModel, destinationsModel, filterModel, addPointButton) => {

    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#addPointButton = addPointButton;
    this.#routePoints = [...this.#pointsModel.points].sort(sortPointDefault);
    this.#routeOffers = getAllOfferType([...this.#offersModel.offersByType], [...this.#offersModel.allOffers]);

    this.#sourcedRoutePoints = [...this.#pointsModel.points].sort(sortPointDefault);
    this.#allDestinations = [...this.#destinationsModel.destinations];

    this.#pointNewComponent = new EditPointView(this.#pointEmpty, this.#allDestinations, this.#routeOffers, this.#typeFormElement);
    this.#pointNewComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointNewComponent.setClickResetHandler(this.#closeNewFormClick);

    this.#renderRoute();

  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };


  #handlePointChange = (updatedPoint) => {
    this.#routePoints = updatePoint(this.#routePoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#allDestinations, this.#routeOffers);
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

  #renderPoint = (point, allDestinations, allOffers) => {

    const pointPresenter = new PointPresenter(this.#routeComponent.element, this.#handlePointChange, this.#handleModeChange, this.#pointNewComponent);
    pointPresenter.init(point, allDestinations, allOffers);
    this.#pointPresenter.set(point.id, pointPresenter);

  };

  #renderPoints = (from, to, allDestinations, allOffers) => {
    this.#routePoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point, allDestinations, allOffers));
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointList = () => {
    render(this.#routeComponent, this.#routeContainer);
    this.#renderPoints(0, this.#routePoints.length, this.#allDestinations, this.#routeOffers);
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

  #renderNewPoint = () => {
    this.#handleModeChange();
    this.#handleSortTypeChange(this.#defaultSortType);
    this.#pointNewComponent.reset(this.#pointEmpty, this.#allDestinations);
    render(this.#pointNewComponent, this.#routeComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFormNewPoint = () => {
    this.#addPointButton.addEventListener('click', this.#renderNewPoint);
  };


  #closeNewFormSubmit = () => {
    remove(this.#pointNewComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointNewComponent.reset(this.#pointEmpty, this.#allDestinations);
      this.#closeNewFormSubmit();
    }
  };

  #handleFormSubmit = () => {
    this.#closeNewFormSubmit();
  };


  #closeNewFormClick = () => {
    this.#pointNewComponent.reset(this.#pointEmpty, this.#allDestinations);
    remove(this.#pointNewComponent);
  };

  #renderRoute = () => {
    if (this.#routePoints.length === 0) {
      this.#renderMsgEmpty(this.#filterModel);
      return;
    }
    this.#renderSort();
    this.#renderFormNewPoint();
    this.#renderPointList();
  };
}
