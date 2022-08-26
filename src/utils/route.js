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
