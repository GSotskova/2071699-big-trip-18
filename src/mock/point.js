import {humanizeTaskDueDate, getRandomInteger} from '../utils.js';
import {DESCRIPTIONS,TYPES,CITIES} from '../const.js';

const generateType = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);
  return TYPES[randomIndex];
};
const generateDescription = () => {
  const randomIndex = getRandomInteger(0, DESCRIPTIONS.length - 1);
  return DESCRIPTIONS[randomIndex];
};

const generateCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);
  return CITIES[randomIndex];
};

const generateDestination = (i) => ({
  id: i,
  description: generateDescription(),
  name:  generateCity(),
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 100)}`,
      description: generateDescription()
    }
  ]

});


const generateOffer = (i) => ({
  id:i,
  type: TYPES[i],
  title: 'Upgrade to a business class',
  price: getRandomInteger(50, 200)
});


const generatePoint = (i) => {
  const randomNumber = getRandomInteger(0,5);
  const OFFERS = new Set(Array.from({length: randomNumber},()=> getRandomInteger(0,10)));
  return {
    price: getRandomInteger(100, 500),
   // dateFrom: "2019-07-10T22:55:56.845Z",
   // dateTo: "2019-07-11T11:22:13.375Z",
    destination: i,
    id: i,
    isFavorite: false,
    offers: [...OFFERS],
    type: generateType(),
  };
};

export {generateDestination,generateOffer, generatePoint};
