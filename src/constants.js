import dayjs from 'dayjs';

export const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'];

export const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
export const CITIES = [ 'Mexico', 'Bern', 'Prague', 'Ottawa', 'Paris', 'Moscow','London','Athens','New York','Istanbul'];

export const SortType = {
  DEFAULT: 'Day',
  DATE_EVENT: 'Event',
  DATE_TIME: 'Time',
  DATE_PRICE: 'Price',
  DATE_OFFERS: 'Offers',
};

export const POINT_COUNT = 9;


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

export const COUNT_OFFERS_TYPE = 5;

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PAST: 'Past',
};
