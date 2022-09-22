import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePresenter from './presenter/route-presenter.js';
import PointsApiService from './points-api-service.js';


const AUTHORIZATION = 'Basic fdhgke7t6fhvdgkt645';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';
const siteHeaderElement = document.querySelector('.page-header');
const siteTripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteBodyElement = document.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

const addPointButtonElement = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteTripFiltersElement, filterModel);

const routePresenter = new RoutePresenter(siteBodyContainerElement, pointsModel, filterModel);

const handleNewTaskFormClose = () => {
  addPointButtonElement.disabled = false;
};

const handleNewPointButtonClick = () => {
  routePresenter.createPoint(handleNewTaskFormClose);
  addPointButtonElement.disabled = true;
};

addPointButtonElement.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
pointsModel.init();
routePresenter.init(addPointButtonElement);
