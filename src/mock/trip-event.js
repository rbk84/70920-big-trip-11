import {EventType, EVENT_TYPES, CITY} from "../const.js";

export const DefaultOffers = [{
  type: EventType.FLIGHT,
  title: `Add meal`,
  price: 50,
}, {
  type: EventType.CHECKIN,
  title: `Add breakfast`,
  price: 50,
}, {
  type: EventType.FLIGHT,
  title: `Add luggage`,
  price: 50,
}, {
  type: EventType.SIGHTSEEING,
  title: `Book tickets`,
  price: 40,
}, {
  type: EventType.SIGHTSEEING,
  title: `Lunch in city`,
  price: 30,
}, {
  type: EventType.TAXI,
  title: `Order Uber`,
  price: 20,
}, {
  type: EventType.DRIVE,
  title: `Rent a car`,
  price: 200,
}, {
  type: EventType.FLIGHT,
  title: `Switch to comfort`,
  price: 80,
}, {
  type: EventType.FLIGHT,
  title: `Choose seats`,
  price: 5,
}, {
  type: EventType.FLIGHT,
  title: `Travel by train`,
  price: 40,
}];

// случайный элемент массива
const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

// случайное число из диапазона
const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

// выбрать все офферы одного типа
const getTypeOffers = (offersObj, typeName) => {
  return offersObj.filter((offer) => offer.type === typeName);
};

// получение списка рандомных offers в количестве от 1 до длины массива
const getRandomOffers = (offers) => {
  const countOffers = getRandomIntegerNumber(1, offers.length);
  const randomOffers = [];
  for (let i = 0; i < countOffers; i++) {
    randomOffers.push(getRandomArrayItem(offers));
  }
  return randomOffers;
};


const generateTripEvent = () => {
  const type = getRandomArrayItem(EVENT_TYPES);
  const offersSelected = getTypeOffers(DefaultOffers, type);
  const timestamp = new Date().getTime();
  const startTimestamp = timestamp + getRandomIntegerNumber(0, 86400000);
  const endTimestamp = startTimestamp + getRandomIntegerNumber(0, 86400000);

  return {
    eventType: type,
    eventCity: getRandomArrayItem(CITY),
    timestamp,
    startTimestamp,
    endTimestamp,
    offersAll: offersSelected,
    randomOffers: offersSelected ? getRandomOffers(offersSelected) : ``
  };
};

const generateTripEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTripEvent);
};


export {getRandomIntegerNumber, generateTripEvent, generateTripEvents};