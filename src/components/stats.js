import AbstractSmartComponent from "./abstract-smart-component.js";
import {EVENT_TYPES_TRANSPORT, typeIcons} from "../const.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";

const BAR_HEIGHT = 46;

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const getEventsType = (events) => {
  return events.map((event) => event.eventType).filter(getUniqItems);
};

const calculateTypeCount = (events, type) => {
  return events.filter((it) => it.eventType === type).length;
};

const calculateTypePrice = (events, type) => {
  const chartTypeEvents = events.filter((it) => it.eventType === type);

  return chartTypeEvents.reduce((accumulator, item) => accumulator + item.price, 0);
};

const getDuration = (start, end) => { // продолжительность точки
  const eventStart = moment(start);
  const eventEnd = moment(end);
  const duration = eventEnd.diff(eventStart);

  return moment.duration(duration).hours();
};

const calculateTypeDuration = (events, type) => {
  const chartDurationEvents = events.filter((it) => it.eventType === type);

  return chartDurationEvents.reduce((accumulator, item) => accumulator + getDuration(item.startTimestamp, item.endTimestamp), 0)
};

const renderMoneyChart = (moneyCtx, events) => {

  const eventTypes = getEventsType(events);

  const eventPrices = eventTypes.map((type) => calculateTypePrice(events, type));

 moneyCtx.height = BAR_HEIGHT * eventTypes.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        data: eventPrices,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
            callback: (eventType) => {
              return `${typeIcons[eventType]} ${eventType}`;
            },
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, events) => {
  const eventTypes = getEventsType(events).filter(type => type.indexOf() !== EVENT_TYPES_TRANSPORT.indexOf(type));

  const eventCount = eventTypes.map((type) => calculateTypeCount(events, type));

  transportCtx.height = BAR_HEIGHT * eventTypes.length;

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        data: eventCount,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
            callback: (eventType) => {
              return `${typeIcons[eventType]} ${eventType}`;
            },
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpendChart = (timeSpendCtx, events) => {

  const eventTypes = getEventsType(events);

  const eventDurations = eventTypes.map((type) => calculateTypeDuration(events, type));

  timeSpendCtx.height = BAR_HEIGHT * eventTypes.length;

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        data: eventDurations,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
            callback: (eventType) => {
              return `${typeIcons[eventType]} ${eventType}`;
            },
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


const createStatsTemplate = () => {
  return (
    `<section class="statistics visually-hidden">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Stats extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  recoveryListeners() {}

  rerender(events) {
    this._events = events;

    // super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._events.getEvents());
    this._transportChart = renderTransportChart(transportCtx, this._events.getEvents());
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._events.getEvents());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }
    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }
    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }


}