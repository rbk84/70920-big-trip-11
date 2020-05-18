import AbstractSmartComponent from "./abstract-smart-component.js";
import {EVENT_TYPES_ACTIVITY, EVENT_TYPES_TRANSPORT} from "../const.js";
import {getTypeOffers} from "../mock/trip-event.js";
import flatpickr from "flatpickr";
import {encode} from "he";
import "flatpickr/dist/flatpickr.min.css";

const createEventTypesMarkup = (eventTypes, id) => {
  return eventTypes
    .map((eventType) => {

      const eventTypeValue = eventType.toLowerCase();

      return (
        `<div class="event__type-item">
          <input
            id="event-type-${eventTypeValue}-${id}"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${eventType}">
          <label
            class="event__type-label  event__type-label--${eventTypeValue}"
            for="event-type-${eventTypeValue}-${id}">
              ${eventType}
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

// список городов в форме редактирования
const createCityMarkup = (cities) => {
  return cities
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    })
    .join(`\n`);
};

// полученные офферы, сравниваем всеь список офферов типа с офферами точки маршрута, совпавшие - чекнутые
const createOffersSelectorMarkup = (offersTypeAll, eventOffers, id) => {
  return offersTypeAll
    .map((offerTypeAll) => {

      const isOfferExist = eventOffers.some((offer) => offerTypeAll === offer);

      const isChecked = isOfferExist ? true : ``;

      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox  visually-hidden" 
            id="event-offer-${offerTypeAll.title}-${offerTypeAll.price}-${id}" 
            type="checkbox" 
            name="event-offer-${offerTypeAll.type}"
            ${isChecked ? `checked` : ``} 
            />
          <label 
            class="event__offer-label" 
            for="event-offer-${offerTypeAll.title}-${offerTypeAll.price}-${id}"
          >
            <span class="event__offer-title">${offerTypeAll.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerTypeAll.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createTripEventEditTemplate = (event, eventType, offers, cities) => {
  const {id, eventCity: notSanitizedCity, price, isFavorite, destination, eventOffers} = event;

  const offersTypeAll = getTypeOffers(offers, eventType);

  const eventCity = encode(notSanitizedCity);

  const eventTypesTransferMarkup = createEventTypesMarkup(EVENT_TYPES_TRANSPORT.slice(), id);
  const eventTypesActivityMarkup = createEventTypesMarkup(EVENT_TYPES_ACTIVITY.slice(), id);
  const eventCityMarkup = createCityMarkup(cities);
  const isOffersShowing = offersTypeAll.length > 0; // есть лиs offers
  const offersSelectorMarkup = isOffersShowing ? createOffersSelectorMarkup(offersTypeAll, eventOffers, id) : ``;

  return (
    `<li class="trip-events__item">
      <form class="trip-events__item event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
  
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                
                ${eventTypesTransferMarkup}
                
              </fieldset>
  
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                
                ${eventTypesActivityMarkup}
                
              </fieldset>
            </div>
          </div>
  
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${eventType} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${eventCity}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${eventCityMarkup}
            </datalist>
          </div>
  
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
          </div>
  
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
          </div>
  
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
  
          <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-${id}">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
  
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
  ${isOffersShowing || destination ?
      `<section class="event__details">` : ``}
         ${isOffersShowing ?
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
        <div class="event__available-offers">
            
          ${offersSelectorMarkup}
             
        </div>
      </section>` : ``}
          
        ${destination ?
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
            <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
            <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
            <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
            <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
          </div>
        </div>
      </section>` : ``}
        ${isOffersShowing && destination ? `</section>` : ``}
      </form>
    </li>`
  );
};

const parseFormData = (formData, eventType, startTimestamp, endTimestamp) => {
  const eventCity = encode(formData.get(`event-destination`));
  const price = formData.get(`event-price`);
  let eventOffers = [];

  return {
    eventType,
    startTimestamp,
    endTimestamp,
    price,
    eventCity,
    eventOffers,
  };
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, offers, cities) {
    super();
    this._event = event;
    this._offers = offers;
    this._cities = cities;

    this._eventType = this._event.eventType;

    this._isFormDirty = false;

    this._startFlatpickr = null;
    this._endFlatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._inputDestination = null;
    this._form = null;
    this._applyFlatpickr();
    this._subscribeOnEvents(offers);
    this._initFormValidation();
  }

  get isFormValid() {
    return this._form.checkValidity();
  }

  getData() {
    return parseFormData(new FormData(this._form), this._eventType, this._startFlatpickr.selectedDates[0].valueOf(), this._endFlatpickr.selectedDates[0].valueOf());
  }

  getTemplate() {
    return createTripEventEditTemplate(this._event, this._eventType, this._offers, this._cities);
  }

  removeElement() {
    this._destroyFlatpickr();

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._favoriteButtonClickHandler);
    this._subscribeOnEvents();
    this._initFormValidation();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    this._eventType = this._event.eventType;

    this.rerender();
  }

  destroy() {
    this._destroyFlatpickr();
  }

  _applyFlatpickr() {
    this._destroyFlatpickr();

    const eventStart = this.getElement().querySelector(`#event-start-time-1`);
    const eventEnd = this.getElement().querySelector(`#event-end-time-1`);

    this._startFlatpickr = this._createFlatpickr(eventStart, this._event.startTimestamp);

    this._endFlatpickr = this._createFlatpickr(eventEnd, this._event.endTimestamp);
  }

  _createFlatpickr(inputField, date) {
    return flatpickr(inputField, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: date || ``,
    });
  }

  _destroyFlatpickr() {
    if (this._startFlatpickr) {
      this._startFlatpickr.destroy();
      this._startFlatpickr = null;
    }
    if (this._endFlatpickr) {
      this._endFlatpickr.destroy();
      this._endFlatpickr = null;
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const selectTypesList = element.querySelector(`.event__type-list`);

    if (selectTypesList) {
      selectTypesList.addEventListener(`change`, (evt) => {

        this._eventType = evt.target.value;

        this.rerender();
      });
    }
  }

  _initFormValidation() {
    this._form = this.getElement().querySelector(`form`);
    this._inputDestination = this._form.querySelector(`.event__input--destination`);

    this._inputDestination.addEventListener(`input`, (_evt) => {
      if (this._isFormDirty) {
        this._validatedDestination();
      }
    });
  }

  _validateForm() {
    this._validatedDestination(this._inputDestination);
    this._form.reportValidity();
  }

  _validatedDestination() {
    let inputText = this._inputDestination.value;

    if (inputText) {
      inputText = `${inputText.charAt(0).toUpperCase()}${inputText.slice(1)}`;
    }

    const city = this._cities.includes(inputText);

    if (city) {
      this._inputDestination.value = inputText;
      this._inputDestination.setCustomValidity(``);
      this._inputDestination.style.backgroundColor = `transparent`;
    } else {
      this._inputDestination.setCustomValidity(`Выберите значение из списка`);
      this._inputDestination.style.backgroundColor = `rgba(255, 0, 0, .5)`;
    }
  }

  setSubmitHandler(handler) {
    if (!this._submitHandler) {
      this._submitHandler = (evt) => {
        this._isFormDirty = true;
        this._validateForm();
        handler(evt);
      };
    }

    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._submitHandler);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    if (!this._deleteButtonClickHandler) {
      this._deleteButtonClickHandler = handler;
    }
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, handler);

    if (!this._favoriteButtonClickHandler) {
      this._favoriteButtonClickHandler = handler;
    }

  }
}
