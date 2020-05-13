import {FilterType} from "../const.js";

export const getEventsByFilter = (events, filterType) => {
  const today = new Date().getTime();
  let filteredEvents = [];

  switch (filterType) {
    case FilterType.EVERYTHING:
      filteredEvents = events;
      break;
    case FilterType.FUTURE:
      filteredEvents = events.filter((event) => event.startTimestamp > today);
      break;
    case FilterType.PAST:
      filteredEvents = events.filter((event) => event.startTimestamp < today);
      break;
  }

  return filteredEvents;
};