import {transformTimeFormat} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {getUserRating, getFavoriteGenre, getGenreStatistics} from "../utils/common.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {render, createElement} from "../utils/render.js";

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

const getFiltredFilmsByWatchDate = (films, numberOfDays) => {
  const filtredFilms = films.slice(0, films.length).filter((film) => {
    return (Math.floor((new Date() - film.watchingDate) / 8640000)) < numberOfDays;
  });
  return filtredFilms;
};

const createStatsTemplate = (films, favoriteFilms) => {
  const durations = films.map((it) => it.duration);
  const totalMovies = films.length;
  const totalDuration = films.length > 0 ? durations.reduce((a, b) => a + b) : `0`;
  const topGenre = favoriteFilms.length > 0 ? getFavoriteGenre(favoriteFilms) : ``;
  return (
    `<ul class="statistic__text-list"> 
    <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${totalMovies} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${(totalDuration === `0`) ? `0` : transformTimeFormat(totalDuration)}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
      </ul>`
  );
};

const createStatisticsSectionTemplate = (films) => {
  const rating = getUserRating(films);
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
  
      <div class="stats__container">

      </div>
  
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>`
  );
};
export default class StatisticsSection extends AbstractSmartComponent {

  constructor(films) {
    super();
    this._films = films;

    this._watchedMovies = this._films.filter((it)=> it.isInHistory);
    this._favoriteMovies = this._films.filter((it)=> it.isInFavorites);
    this._watchedMoviesByAllTime = this._watchedMovies;
    this._watchedMoviesByDay = getFiltredFilmsByWatchDate(this._watchedMovies, 1);
    this._watchedMoviesByWeek = getFiltredFilmsByWatchDate(this._watchedMovies, 7);
    this._watchedMoviesByMonth = getFiltredFilmsByWatchDate(this._watchedMovies, 30);
    this._watchedMoviesByYear = getFiltredFilmsByWatchDate(this._watchedMovies, 365);
    this._favorieMoviesByAllTime = this._favoriteMovies;
    this._favorieMoviesByDay = getFiltredFilmsByWatchDate(this._favoriteMovies, 1);
    this._favorieMoviesByWeek = getFiltredFilmsByWatchDate(this._favoriteMovies, 7);
    this._favorieMoviesByMonth = getFiltredFilmsByWatchDate(this._favoriteMovies, 30);
    this._favorieMoviesByYear = getFiltredFilmsByWatchDate(this._favoriteMovies, 365);
    this._genreChart = null;
    this._statsElement = null;

    this._renderCharts(this._watchedMovies);
    this._renderStats(this._watchedMovies, this._favoriteMovies);
    this.recoveryListeners();
  }

  getTemplate() {
    return createStatisticsSectionTemplate(this._watchedMovies);
  }

  getStatsTemplate(films, favoriteFilms) {
    return createStatsTemplate(films, favoriteFilms);
  }

  getStatsElement(films, favoriteFilms) {
    if (!this._statsElement) {
      this._statsElement = createElement(this.getStatsTemplate(films, favoriteFilms));
    }

    return this._statsElement;
  }


  show() {
    super.show();
    this._renderCharts(this._watchedMovies);
  }

  recoveryListeners() {
    this.getElement().querySelectorAll(`.statistic__filters-input`).forEach((it) => {
      it.addEventListener(`change`, (evt) => {
        const statisticFilter = evt.target.value;
        switch (statisticFilter) {
          case StatisticFilter.ALL:
            this._renderCharts(this._watchedMoviesByAllTime);
            this._renderStats(this._watchedMoviesByAllTime, this._favorieMoviesByAllTime);
            break;
          case StatisticFilter.TODAY:
            this._renderCharts(this._watchedMoviesByDay);
            this._renderStats(this._watchedMoviesByDay, this._favorieMoviesByDay);
            break;
          case StatisticFilter.WEEK:
            this._renderCharts(this._watchedMoviesByWeek);
            this._renderStats(this._watchedMoviesByWeek, this._favorieMoviesByWeek);
            break;
          case StatisticFilter.MONTH:
            this._renderCharts(this._watchedMoviesByMonth);
            this._renderStats(this._watchedMoviesByMonth, this._favorieMoviesByMonth);
            break;
          case StatisticFilter.YEAR:
            this._renderCharts(this._watchedMoviesByYear);
            this._renderStats(this._watchedMoviesByYear, this._favorieMoviesByYear);
            break;
        }
      });
    });
  }

  _renderCharts(films) {
    this._watchedMovies = films;

    const element = this.getElement();

    const statisticsCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._statsElement = null;

    this._genreChart = renderGenresChart(statisticsCtx, films);
  }

  _resetCharts() {
    if (this._genreChart) {
      this._genreChart.destroy();
      this._genreChart = null;
    }
  }

  _renderStats(films, favoriteFilms) {

    const element = this.getElement();

    const statsContainer = element.querySelector(`.stats__container`);

    statsContainer.innerHTML = ``;

    render(statsContainer, this.getStatsElement(films, favoriteFilms));

  }
}
