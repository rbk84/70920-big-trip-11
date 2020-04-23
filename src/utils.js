import {ONE_DAY, ONE_HOUR, ONE_MINUTE} from "./const.js";
import {generateTripEvents} from "./mock/trip-event.js";
import {EVENT_COUNT} from "./const.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : Number(value);
};

export const eventTime = (timestamp) => {
  const hours = castTimeFormat(new Date(timestamp).getHours());
  const minutes = castTimeFormat(new Date(timestamp).getMinutes());

  return `${hours}:${minutes}`;
};

export const eventDuration = (start, end) => {
  const duration = (end - start); // разница времени старта и финиша

  const eventDurDay = Math.floor(duration / ONE_DAY); // количество дней
  const eventDurHour = Math.floor((duration - (eventDurDay * ONE_HOUR)) / ONE_HOUR); // количество часов
  const eventDurMin = Math.floor((duration - (eventDurDay * ONE_DAY) - (eventDurHour * ONE_HOUR)) / ONE_MINUTE);

  const days = eventDurDay > 0 ? castTimeFormat(eventDurDay) + `D` : ``;
  const hours = eventDurHour > 0 ? castTimeFormat(eventDurHour) + `H` : `00H`;
  const minutes = eventDurMin > 0 ? castTimeFormat(eventDurMin) + `M` : `00M`;

  return `${days} ${hours} ${minutes}`;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const events = generateTripEvents(EVENT_COUNT);

events.sort((first, second) => {
  if (first.startTimestamp > second.startTimestamp) {
    return 1;
  }
  if (first.startTimestamp < second.startTimestamp) {
    return -1;
  }

  return 0;
});

export const eventsGroups = new Map();
events.forEach((event) => {
  const startEventDate = new Date(event.startTimestamp);

  const startDay = new Date(startEventDate.getFullYear(), startEventDate.getMonth(), startEventDate.getDate(), 0, 0, 0, 0);
  const endDay = new Date(startEventDate.getFullYear(), startEventDate.getMonth(), startEventDate.getDate(), 23, 59, 59, 999);

  const startTimestampDay = startDay.getTime();
  const endTimestampDay = endDay.getTime();

  if (!eventsGroups.has(startTimestampDay)) {
    const dayEvents = events.filter((event1) => {

      return startTimestampDay <= event1.startTimestamp && event1.startTimestamp <= endTimestampDay;

    });

    eventsGroups.set(startTimestampDay, dayEvents);
  }
});