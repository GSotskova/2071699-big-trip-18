import {render, replace, remove} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #PointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #destinations = null;
  #allOffers = null;

  #changeData = null;
  #changeMode = null;
  #pointNewComponent = null;

  #mode = Mode.DEFAULT;
  #typeFormElement = 'Edit'; //т.к.используется одна View  для новой точки маршрута и для формы редактирования добавляем признак для формы "New"/"Edit"

  constructor(PointListContainer, changeData, changeMode, pointNewComponent) {
    this.#PointListContainer = PointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#pointNewComponent = pointNewComponent;
  }

  init = (point, destinations, allOffers) => {
    this.#point = point;
    this.#destinations = destinations;
    this.#allOffers = allOffers;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point, destinations, allOffers);

    this.#pointEditComponent = new EditPointView(point, destinations, allOffers, this.#typeFormElement);


    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setClickRollUpHandler(this.#handleClick);
    this.#pointEditComponent.setClickResetHandler(this.#handleClick);

    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#PointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);

  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point, this.#destinations);
      this.#replaceFormToPoint();
    }
  };

  #replacePontToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point, this.#destinations);
      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleEditClick = () => {
    remove(this.#pointNewComponent);
    this.#replacePontToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleClick = () => {
    this.#pointEditComponent.reset(this.#point, this.#destinations);
    this.#replaceFormToPoint();
  };
}
