export const EVENT_COUNT = 5;

export const EventType = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  CHECKIN: `Check-in`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`,
};

export const EVENT_TYPES = [
  EventType.TAXI,
  EventType.BUS,
  EventType.TRAIN,
  EventType.SHIP,
  EventType.TRANSPORT,
  EventType.DRIVE,
  EventType.FLIGHT,
  EventType.CHECKIN,
  EventType.SIGHTSEEING,
  EventType.RESTAURANT,
];

export const CITY = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`
];

export const FILTERS = [
  `Everything`,
  `Future`,
  `Past`
];

export const MONTH = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`,
];

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60; // 1000 * 60 * 60
export const ONE_DAY = ONE_HOUR * 24; // 1000 * 60 * 60 * 24