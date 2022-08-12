import RouteView from '../view/route-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class RoutePresenter {
  routeComponent = new RouteView();

  init = (routeContainer) => {
    this.routeContainer = routeContainer;

    render(this.routeComponent, this.routeContainer);
    render(new EditPointView(), this.routeComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.routeComponent.getElement());
    }
  };
}
