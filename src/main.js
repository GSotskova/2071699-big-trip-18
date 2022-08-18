import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import {render} from './render.js';
import RoutePresenter from './presenter/route-presenter.js';
import PointsModel from './model/points-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteBodyElement = document.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const routePresenter = new RoutePresenter();

render(new FilterView(), siteTripFiltersElement);
render(new SortView(), siteBodyContainerElement);
routePresenter.init(siteBodyContainerElement, pointsModel);
