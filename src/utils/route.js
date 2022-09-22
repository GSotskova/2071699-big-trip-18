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


export const sortDuration = (point1,point2) => {
  const duration1 = dayjs(point1.dateTo).diff(dayjs(point1.dateFrom));
  const duration2 = dayjs(point2.dateTo).diff(dayjs(point2.dateFrom));
  return duration2 - duration1;
};

export const sortPrice = (point1,point2) => point2.price - point1.price;


export const sortPointDefault = (point1,point2) => {
  const date1 = point1.dateFrom;
  const date2 = point2.dateFrom;
  return date1 - date2;
};
