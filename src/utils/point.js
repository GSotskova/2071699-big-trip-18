import dayjs from 'dayjs';

//находим пункт назначения для конкретной точки по ID
export const getDestinationById = (pointDestination, destinations) => destinations.find((destination) => destination.id === pointDestination);

//находим ID пункта назначения по наименованию
export const getDestinationIdByName = (name, destinations) => destinations.find((destination) => destination.name === name).id;

//получаем список наименований всех точек назначения
export const getDestinationsNamesList = (destinations) => destinations.map((el) => el.name);

//getAllOfferType - Получаем "склеенный" массив объектов OffersByType и Offers (записываем в totalOffers)
const getOffersByCurrentType = (currentOffer, allOffers, addedOffers) => {
  let objNew = {};
  const offersByCurrentType = [];
  currentOffer.offers.forEach((el) => {
    objNew = allOffers.find((offer) => el === offer.id);
    objNew['type'] = currentOffer.type;
    if (!addedOffers.includes(objNew)) {
      offersByCurrentType.push(objNew);
    }
  });
  return offersByCurrentType;
};

export const getAllOffersWithType = (offersByType, allOffers) => {
  let totalOffers = [];
  offersByType.forEach((el) => {
    if (el.offers.length !== 0) {
      totalOffers = [...totalOffers,...getOffersByCurrentType(el, allOffers, totalOffers)];
    }
  });
  return totalOffers;
};

//получаем массив объектов с опциями для конкретной точки маршрута
export const getPointOffers = (pointOffersIds, allOffers) =>pointOffersIds.map((offerId) => allOffers.find((offer) => offer.id === offerId));


export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
