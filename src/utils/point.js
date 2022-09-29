import dayjs from 'dayjs';

//находим пункт назначения для конкретной точки по ID
export const getDestinationById = (pointDestination, destinations) => destinations.find((destination) => destination.id === pointDestination);

//находим наименование пункта назначения для конкретной точки по ID
export const getDestinationNameById = (pointDestination, destinations) => destinations.find((destination) => destination.id === pointDestination).name;

//находим ID пункта назначения по наименованию
export const getDestinationIdByName = (name, destinations) => destinations.find((destination) => destination.name === name).id;

//получаем список наименований всех точек назначения
export const getDestinationsNamesList = (destinations) => destinations.map((el) => el.name);

//получаем массив объектов с опциями для конкретной точки маршрута
export const getPointOffers = (pointOffersIds, pointType, allOffers) => {
  const offersInType = allOffers.find((offer) => offer.type === pointType).offers;
  return pointOffersIds.map((offerId) => offersInType.find((offer) => offer.id === offerId));
};

//получаем массив сумм с опций для конкретной точки маршрута
export const getPricePointOffers = (pointOffersIds, pointType, allOffers) => {
  const offersInType = allOffers.find((offer) => offer.type === pointType).offers;
  return pointOffersIds.map((offerId) => offersInType.find((offer) => offer.id === offerId).price);
};


export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'm');

export const isPriceEqual = (priceA, priceB) => (priceA === null && priceB === null) || priceA === priceB;

export const getSummElementsArray = (arr) => arr.reduce((a, b) => a + b, 0);
