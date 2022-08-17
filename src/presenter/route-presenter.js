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

  init = (routeContainer, pointsModel) => {
    this.routeContainer = routeContainer;
    this.pointsModel = pointsModel;
    this.routeDestinations = [...this.pointsModel.getDestinations()];
    this.routePoints = [...this.pointsModel.getPoints()];
    this.routeOffers = [...this.pointsModel.getOffers()];

    render(this.routeComponent, this.routeContainer);

    render(this.itemNewPointComponent, this.routeComponent.getElement());
    render(new NewPointView(), this.itemNewPointComponent.getElement());


    for (let i = 0; i < this.routePoints.length; i++) {

      const destination = this.routeDestinations.find((el) => el.id === this.routePoints[i].destination);

      const pointOffers = this.routeOffers.filter((el) => this.routePoints[i].offers.includes(el.id) );
      const pointTypeOffer = [];
      pointOffers.forEach((el) => pointTypeOffer.push(el));
      const pointIdOffer = [];
      pointOffers.forEach((el) => pointIdOffer.push(el.id));
      if (i === 0) {
        render(this.itemEditPointComponent, this.routeComponent.getElement());
        render(
          new EditPointView(this.routePoints[i], destination, this.routeOffers, pointIdOffer),
          this.itemEditPointComponent.getElement()
        );
      }
      render(
        new PointView(this.routePoints[i], destination, pointTypeOffer),
        this.routeComponent.getElement()
      );
    }
  };
}
