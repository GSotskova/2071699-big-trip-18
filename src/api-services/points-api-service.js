import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (point) => {
    const adaptedPoint = {
      'base_price': Number(point.price),
      'date_from': point.dateFrom.toISOString(),
      'date_to': point.dateTo.toISOString(),
      'destination': point.destination,
      'id': point.id,
      'is_favorite': point.isFavorite,
      'offers': point.offers,
      'type': point.type
    };
    return adaptedPoint;
  };
}
