//находим пункт назначения для конкретной точки по ID
export const getDestinationById = (pointDestination, destinations) => destinations.find((destination) => destination.id === pointDestination);

//находим ID пункта назначения по наименованию
export const getDestinationIdByName = (name, destinations) => destinations.find((destination) => destination.name === name).id;

//получаем список наименований всех точек назначения
export const getDestinationListName = (destinations) => destinations.map((el) => el.name);

//getAllOfferType - Получаем "склеенный" массив объектов OffersByType и Offers (записываем в totalOffers)
const getOffersType = (currentOffer, allOffers, addedOffers) => {
  let objNew = {};
  currentOffer.offers.forEach((el) => {objNew = allOffers.find((offer) => el === offer.id);
    objNew['type'] = currentOffer.type;
    if (!addedOffers.includes(objNew)) {addedOffers.push(objNew);}
  });
  return addedOffers;
};

export const getAllOfferType = (offersByType, allOffers) => {
  const totalOffers = [];
  offersByType.forEach((el) => el.offers.length !== 0 ? getOffersType(el, allOffers, totalOffers) : '');
  return totalOffers; };

//получаем массив опций для конкретной точки маршрута
export const getOfferPoint = (pointOffers, allOffers) =>pointOffers.map((offerId) => allOffers.find((offer) => offer.id === offerId));

//получаем массив опций для конкретного типа точки маршрута
export const getOfferTypePoint = (point, allOffers) => point.offers.map((type) => allOffers.find((offer) => offer.type === type));

