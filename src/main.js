import FilterModel from './model/filter-model.js';
import RoutePresenter from './presenter/route-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteBodyElement = document.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

const addPointButtonElement = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteTripFiltersElement, filterModel);
const routePresenter = new RoutePresenter(siteBodyContainerElement, pointsModel, offersModel, destinationsModel, filterModel);

const handleNewTaskFormClose = () => {
  addPointButtonElement.disabled = false;
};

const handleNewPointButtonClick = () => {
  routePresenter.createPoint(handleNewTaskFormClose);
  addPointButtonElement.disabled = true;
};

addPointButtonElement.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
routePresenter.init(addPointButtonElement);
