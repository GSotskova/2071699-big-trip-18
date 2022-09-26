import {render, RenderPosition, remove} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType} from '../constants.js';
import {pointEmpty} from '../constants.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #pointEditComponent = null;

  #destinations = null;
  #allOffers = null;
  #changeData = null;
  #typeFormName = 'New'; //т.к.используется одна View  для новой точки маршрута и для формы редактирования добавляем признак для формы "New"/"Edit"

  #destroyCallback = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback, destinations, allOffers) => {
    this.#destroyCallback = callback;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditPointView(pointEmpty, this.#destinations, this.#allOffers, this.#typeFormName);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setClickResetHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);

  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}
