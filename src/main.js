import FilterModel from './model/filter-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePresenter from './presenter/route-presenter.js';
import TotalRoutePresenter from './presenter/total-route-presenter.js';
import OffersApiService from './api-services/offers-api-service.js';
import DestinationsApiService from './api-services/destinations-api-service.js';
import PointsApiService from './api-services/points-api-service.js';
import {END_POINT, AUTHORIZATION} from './constants.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = siteHeaderElement.querySelector('.trip-main');
const siteTripFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');

const siteBodyElement = document.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

const addPointButtonElement = document.querySelector('.trip-main__event-add-btn');


const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteTripFiltersElement, filterModel, pointsModel);

const routePresenter = new RoutePresenter(siteBodyContainerElement, pointsModel, destinationsModel, offersModel, filterModel);
const totalRoutePresenter = new TotalRoutePresenter(siteTripMainElement, pointsModel, destinationsModel, offersModel);

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
  await totalRoutePresenter.init();
};

runInit();

routePresenter.init();
