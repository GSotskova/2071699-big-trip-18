import RouteView from '../view/route-view.js';
import ItemView from '../view/item-view.js';
import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class RoutePresenter {
  routeComponent = new RouteView();
  itemNewPointComponent = new ItemView();
  itemEditPointComponent = new ItemView();

  init = (routeContainer) => {
    this.routeContainer = routeContainer;

    render(this.routeComponent, this.routeContainer);

    render(this.itemNewPointComponent, this.routeComponent.getElement());
    render(new NewPointView(), this.itemNewPointComponent.getElement());

    render(this.itemEditPointComponent, this.routeComponent.getElement());
    render(new EditPointView(), this.itemEditPointComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.routeComponent.getElement());
    }
  };
}
