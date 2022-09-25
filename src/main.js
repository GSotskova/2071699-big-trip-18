import FilterModel from './model/filter-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePresenter from './presenter/route-presenter.js';
import OffersApiService from './api-services/offers-api-service.js';
import DestinationsApiService from './api-services/destinations-api-service.js';
import PointsApiService from './api-services/points-api-service.js';
import {END_POINT, AUTHORIZATION} from './constants.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteBodyElement = document.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

const addPointButtonElement = document.querySelector('.trip-main__event-add-btn');


const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteTripFiltersElement, filterModel);

const routePresenter = new RoutePresenter(siteBodyContainerElement, pointsModel, destinationsModel, offersModel, filterModel);

const handleNewPointFormClose = () => {
  addPointButtonElement.disabled = false;
};

const handleNewPointButtonClick = () => {
  routePresenter.createPoint(handleNewPointFormClose);
  addPointButtonElement.disabled = true;
};
addPointButtonElement.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();

const runInit = async () => {
  await offersModel.init();
  await destinationsModel.init();
  await pointsModel.init();
};

runInit();

routePresenter.init();
