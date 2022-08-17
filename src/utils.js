import dayjs from 'dayjs';
// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


export const getRandomNumber = (min, max) => Math.round((Math.random() * (max - min ) + min) * 10) / 10;

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
