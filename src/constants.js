import dayjs from 'dayjs';

export const SortType = {
  DEFAULT: 'Day',
  DATE_EVENT: 'Event',
  DATE_TIME: 'Time',
  DATE_PRICE: 'Price',
  DATE_OFFERS: 'Offers',
};

export const pointEmpty = {
  price: '',
  dateFrom: dayjs(),
  dateTo:dayjs(),
  destination: 0,
  id: null,
  isFavorite: false,
  offers: [],
  type: 'Flight',
};


export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
};

export const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PAST: 'Past',
};

export const AUTHORIZATION = 'Basic fdhgke7t6fhvdgkt645';
export const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';
