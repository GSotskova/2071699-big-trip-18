import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import ItemView from '../view/item-view.js';
import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import EmptyEverythingView from '../view/empty-everything-view.js';
import EmptyPastView from '../view/empty-past-view.js';
import EmptyFutureView from '../view/empty-future-view.js';
import {render} from '../render.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #routeComponent = new RouteView();
  #itemNewPointComponent = new ItemView();

  #routePoints = [];
  #routeOffers = [];

  init = (routeContainer, pointsModel, offersModel, destinationsModel) => {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#routePoints = [...this.#pointsModel.points];
    this.#routeOffers = [...this.#offersModel.allOffers];


    if (this.#routePoints.length === 0) {
      this.#renderMsgEmpty();
    }
    else {
      render(new SortView(), this.#routeContainer);
      render(this.#routeComponent, this.#routeContainer);
      render(this.#itemNewPointComponent, this.#routeComponent.element);
      render(new NewPointView(), this.#itemNewPointComponent.element);

      for (let i = 0; i < this.#routePoints.length; i++) {

        const destination = this.#destinationsModel.getDestinations(this.#routePoints[i]);
        const pointOffers = [...this.#offersModel.getPointOffer(this.#routePoints[i])];

        this.#renderPoint(this.#routePoints[i], destination, this.#routeOffers, pointOffers);
      }
    }
  };

  #renderPoint = (point, destination, allOffers, pointOffers) => {
    const pointComponent = new PointView(point, destination, pointOffers);
    const pointEditComponent = new EditPointView(point, destination, allOffers, pointOffers);


    const replacePontToForm = () => {
      this.#routeComponent.element.replaceChild(pointEditComponent.element,pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#routeComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePontToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#routeComponent.element);

  };

  #renderMsgEmpty = () => {
    const filterRadioElements = document.querySelectorAll('.trip-filters__filter-input');
    const withoutPointComponent = new EmptyEverythingView();
    const withoutPointPastComponent = new EmptyPastView();
    const withoutPointFutureComponent = new EmptyFutureView();

    render(withoutPointComponent, this.#routeContainer);//изначально выводим сообщение для всех точек маршрута

    //в зависимости от выбранного фильтра меняем сообщение
    const onReplaceMsgOfEmpty = (evt) => {
      this.#routeContainer.querySelector('.trip-events__msg').remove();
      switch (evt.target.value) {
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

    filterRadioElements.forEach((el) => el.addEventListener('change', onReplaceMsgOfEmpty));
  };
}
