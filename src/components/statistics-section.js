import {transformTimeFormat, getRandomDate} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {getUserRating, getFavoriteGenre, getGenreStatistics} from "../utils/common.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const StatisticFilter = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const renderGenresChart = (statisticCtx, films) => {
  const genreStatistics = getGenreStatistics(films);

  const genreLabels = Object.keys(genreStatistics).sort((a, b) => {
    return genreStatistics[b] - genreStatistics[a];
  });
  const genreData = Object.values(genreStatistics).sort((a, b) => {
    return b - a;
  });

  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * genreLabels.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genreLabels,
      datasets: [{
        data: genreData,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const setTimeMark = (films) => {
  films.forEach((film) => {
    Object.assign(film, {watchingDate: getRandomDate(0, 500)});
  });
  return films;
};

const getFiltredFilmsByWatchDate = (films, numberOfDays) => {
  const filtredFilms = films.slice(0, films.length)
                       .filter((film) => {
                         return (Math.floor((new Date() - film.watchingDate) / 86400000)) < numberOfDays;
                       });
  return filtredFilms;
};

const createStatisticsSectionTemplate = (films) => {
  const durations = films.map((it) => it.duration);
  const rating = getUserRating(films);
  const totalMovies = films.length;
  const totalDuration = films.length > 0 ? durations.reduce((a, b) => a + b) : ``;
  debugger;
  const topGenre = films.length > 0 ? getFavoriteGenre(films) : ``;
  const avatar = `images/bitmap@2x.png`;

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src=${avatar} alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rating}</span>
      </p>
  
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>
  
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
  
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${totalMovies} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${transformTimeFormat(totalDuration)}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>
  
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>`
  );
};
export default class StatisticsSection extends AbstractSmartComponent {

  constructor(films) {
    super();
    this._films = films;

    this._watchedMovies = setTimeMark(this._films.filter((it)=> it.isInHistory));
    this._watchedMoviesByAllTime = this._watchedMovies;
    this._watchedMoviesByDay = getFiltredFilmsByWatchDate(this._watchedMovies, 1);
    this._watchedMoviesByWeek = getFiltredFilmsByWatchDate(this._watchedMovies, 7);
    this._watchedMoviesByMonth = getFiltredFilmsByWatchDate(this._watchedMovies, 30);
    this._watchedMoviesByYear = getFiltredFilmsByWatchDate(this._watchedMovies, 365);
    this._genreChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsSectionTemplate(this._watchedMovies);
  }

  show() {
    super.show();
    this.rerender(this._watchedMovies);
  }

  recoveryListeners() {
    this.getElement().querySelectorAll(`.statistic__filters-input`).forEach((it) => {
      it.addEventListener(`change`, (evt) => {
        evt.target.checked = true;
        const statisticFilter = evt.target.value;
        switch (statisticFilter) {
          case StatisticFilter.ALL:
            this.rerender(this._watchedMoviesByAllTime);
            break;
          case StatisticFilter.TODAY:
            this.rerender(this._watchedMoviesByDay);
            break;
          case StatisticFilter.WEEK:
            this.rerender(this._watchedMoviesByWeek);
            break;
          case StatisticFilter.MONTH:
            this.rerender(this._watchedMoviesByMonth);
            break;
          case StatisticFilter.YEAR:
            this.rerender(this._watchedMoviesByYear);
            break;
        }
      });
    });
  }

  rerender(films) {
    this._watchedMovies = films;

    super.rerender();
    this.recoveryListeners();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const statisticsCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._genreChart = renderGenresChart(statisticsCtx, this._watchedMovies);
  }

  _resetCharts() {
    if (this._genreChart) {
      this._genreChart.destroy();
      this._genreChart = null;
    }
  }
  // setStatisticFilterChangeHandler(handler) {
  //   this.getElement().querySelectorAll(`.statistic__filters-input`).forEach((it) => {
  //     it.addEventListener(`change`, (evt) => {
  //       evt.preventDefault();
  //       const statisticFilter = evt.target.value;
  //       console.log(statisticFilter)
  //       // handler(statisticFilter);
  //     });
  //   });
  // }
}
