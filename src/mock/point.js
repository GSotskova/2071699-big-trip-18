import {getRandomInteger, getRandomNumber} from '../utils/common.js';
import {DESCRIPTIONS, TYPES, CITIES} from '../constants.js';
import dayjs from 'dayjs';

const generateType = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);
  return TYPES[randomIndex];
};
const generateDescription = () => {
  const randomIndex = getRandomInteger(0, DESCRIPTIONS.length - 1);
  return DESCRIPTIONS[randomIndex];
};

//генерация даты начала и даты окончания
const generateDate = () => {
  const dayGap = getRandomInteger(1, 31);
  const hourGap = getRandomNumber(1, 24);
  const minGap = getRandomNumber(1, 60);
  //в кач-ве даты начала берем текущую дату плюс случайное кол-во дней, плюс случ кол-во часов и минут
  const datePointFrom = dayjs().add(dayGap, 'day').add(hourGap, 'hour').add(minGap, 'minute');
  //в кач-ве даты окончания берем полученную выше даты начала плюс случ кол-во часов и минут
  const datePointTo = datePointFrom.add(hourGap, 'hour').add(minGap, 'minute');

  return {datePointFrom, datePointTo} ;
};


export const generateDestination = (i) => ({
  id: i, //идентификато начитываем при создании массивы array.from - просто порядковый номер
  description: generateDescription(),
  name:  CITIES[i - 1],
  pictures: [
    {
      // src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 100)}`,
      src: `https://placekitten.com//248/152?r=${getRandomInteger(0, 100)}`,
      description: generateDescription()
    }
  ]

});


export const generateOffer = (i) => ({
  id:i,
  title: `offer ${i}`,
  price: getRandomInteger(50, 200)
});


export const generateOffersByType = (i) => {
  const stepNum = i - 1;
  const OFFERS = new Set(Array.from({length: 5},(_v,i) => i + 5 * stepNum + 1));
  return {
    type: TYPES[i - 1],
    offers: [...OFFERS]
  };};

export const generatePoint = (i) => {
  const randomNumber = getRandomInteger(0, 4);
  const stepNum = i - 1;
  const OFFERS = new Set(Array.from({length: randomNumber},(_v,i) => i + 5 * stepNum + 1)); //формируем массив с уникальными значениями

  //const OFFERS = new Set(Array.from({length: 5},(_v,i) => i + 5 * stepNum + 1));

  const datePoint = generateDate();
  return {
    price: getRandomInteger(100, 500),
    dateFrom: datePoint.datePointFrom,
    dateTo:datePoint.datePointTo,
    destination: i, //для примера поставила просто порядковый номер, чтоб не было совпадений
    id: i,
    isFavorite: false,
    offers: [...OFFERS],
    type: TYPES[i - 1],
  };
};

