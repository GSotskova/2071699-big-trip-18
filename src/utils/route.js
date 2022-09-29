import dayjs from 'dayjs';

export const getdateDiff = (date1, date2) => {
  const dateFrom = dayjs(date1);
  const dateTo = dayjs(date2);

  let diffMin = Math.abs(dateFrom.diff(dateTo, 'minute'));

  const diffDay = Math.floor((diffMin / 60) / 24);
  const strDay = diffDay > 0 ? `${diffDay}D` : '';
  diffMin = diffMin - diffDay * 24 * 60;

  const diffHour = Math.floor(diffMin / 60);
  const strHour = diffHour > 0 ? `${diffHour}H` : '';
  diffMin = diffMin - diffHour * 60;
  const strMin = diffMin > 0 ? `${diffMin}M` : '';

  return `${strDay} ${strHour} ${strMin}`;
};

const sortDestinations = (point1,point2) => {
  const destination1 = point1.destination;
  const destination2 = point2.destination;
  return destination1 - destination2;
};

export const sortDuration = (point1,point2) => {
  const duration1 = dayjs(point1.dateTo).diff(dayjs(point1.dateFrom));
  const duration2 = dayjs(point2.dateTo).diff(dayjs(point2.dateFrom));
  const diffDuration = duration2 - duration1;
  const diffDestinations = sortDestinations(point1,point2);
  return diffDuration === 0 ? diffDestinations : diffDuration; //если продолжительности точек маршрута совпадают, то сортирауем по destination
};

export const sortPrice = (point1,point2) => {
  const diffPrice = point2.price - point1.price;
  const diffDestinations = sortDestinations(point1,point2);
  return diffPrice === 0 ? diffDestinations : diffPrice; //если цены точек маршрута совпадают, то сортирауем по destination
};

export const sortPointDefault = (point1,point2) => {
  const date1 = point1.dateFrom;
  const date2 = point2.dateFrom;
  const diffDates = date1 - date2;
  const diffDestinations = sortDestinations(point1,point2);
  return diffDates === 0 ? diffDestinations : diffDates; //если даты точек маршрута совпадают, то сортирауем по destination
};
