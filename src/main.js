import FilmsComponent from "./components/films";
import FilmsModel from "./models/films.js";
import FilterController from "./controllers/filter.js";
import NoFilmsComponent from "./components/no-films";
import ProfileComponent from "./components/profile";
import StatisticsSectionComponent from "./components/statistics-section";
import StatisticsComponent from "./components/statistics";
import PageController from "./controllers/page.js";

import {generateFilms} from "./mock/film";

import {render} from "./utils/render.js";

const CARDS_COUNT = 24;

const films = generateFilms(CARDS_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

render(headerContainer, new ProfileComponent(filmsModel.getFilms()).getElement());

const filterController = new FilterController(mainContainer, filmsModel);
filterController.render();

const statisticsSectionComponent = new StatisticsSectionComponent(filmsModel.getFilms());

render(mainContainer, statisticsSectionComponent.getElement());
statisticsSectionComponent.hide();

filterController.setStatsClickHandler(() => {
  statisticsSectionComponent.show();
  pageController.hide();
  document.querySelectorAll(`.main-navigation__item`).forEach((it) => {
    it.classList.remove(`main-navigation__item--active`);
  });
  document.querySelector(`.main-navigation__additional`).classList.add(`main-navigation__item--active`);
  filterController.recoveryFilterListener();
});

filterController.setFiltersClickHandler(() => {
  statisticsSectionComponent.hide();
  pageController.show();
  document.querySelector(`.main-navigation__additional`).classList.remove(`main-navigation__item--active`);
  filterController.recoveryStatsListener();
});

const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent, filmsModel);

if (films.length === 0) {
  render(mainContainer, new NoFilmsComponent().getElement());
} else {
  render(mainContainer, filmsComponent.getElement());
  pageController.render();
}

const footerStaticticsContainer = document.querySelector(`.footer__statistics`);

render(footerStaticticsContainer, new StatisticsComponent(films.length).getElement());

