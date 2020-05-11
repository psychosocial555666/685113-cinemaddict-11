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
const footerStaticticsContainer = document.querySelector(`.footer__statistics`);

const profileComponent = new ProfileComponent(filmsModel.getFilms());
render(headerContainer, profileComponent.getElement());

const statisticsSectionComponent = new StatisticsSectionComponent(filmsModel.getFilms());

render(mainContainer, statisticsSectionComponent.getElement());
statisticsSectionComponent.hide();

const statisticsComponent = new StatisticsComponent(films.length);
render(footerStaticticsContainer, statisticsComponent.getElement());

const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent, filmsModel, profileComponent, statisticsSectionComponent);


const filterController = new FilterController(mainContainer, filmsModel, pageController, statisticsSectionComponent);
filterController.render();


if (films.length === 0) {
  render(mainContainer, new NoFilmsComponent().getElement());
} else {
  render(mainContainer, filmsComponent.getElement());
  pageController.render();
}

