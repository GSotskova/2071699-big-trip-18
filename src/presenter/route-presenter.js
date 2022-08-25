import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import ItemView from '../view/item-view.js';
import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import EmptyEverythingView from '../view/empty-everything-view.js';
import EmptyPastView from '../view/empty-past-view.js';
import EmptyFutureView from '../view/empty-future-view.js';
import {render, replace} from '../framework/render.js';

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

  init = (routeContainer, pointsModel, offersModel, destinationsModel, filterModel) => {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#routePoints = [...this.#pointsModel.points];
    this.#routeOffers = [...this.#offersModel.allOffers];


    if (this.#routePoints.length === 0) {
      this.#renderMsgEmpty(this.#filterModel);
    } else {
      render(new SortView(), this.#routeContainer);
      render(this.#routeComponent, this.#routeContainer);
      render(this.#itemNewPointComponent, this.#routeComponent.element);
      render(new NewPointView(), this.#itemNewPointComponent.element);

      this.#routePoints.forEach((point) => {
        const destination = this.#destinationsModel.getDestinations(point);
        const pointOffers = [...this.#offersModel.getPointOffer(point)];

        this.#renderPoint(point, destination, this.#routeOffers, pointOffers);
      });
    }
  };

  #renderPoint = (point, destination, allOffers, pointOffers) => {
    const pointComponent = new PointView(point, destination, pointOffers);
    const pointEditComponent = new EditPointView(point, destination, allOffers, pointOffers);


    const replacePontToForm = () => {
      replace(pointEditComponent,pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePontToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#routeComponent.element);

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
}
