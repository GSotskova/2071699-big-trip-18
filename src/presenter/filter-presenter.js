import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {FilterType, UpdateType} from '../constants.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  get filters() {
    return [FilterType.EVERYTHING, FilterType.FUTURE, FilterType.PAST];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
