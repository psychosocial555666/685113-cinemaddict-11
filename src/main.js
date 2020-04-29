import FilmsComponent from "./components/films";
import FilmsModel from "./models/films.js";
import FilterController from "./controllers/filter.js";
import NoFilmsComponent from "./components/no-films";
import ProfileComponent from "./components/profile";
import StatisticsSectionComponent from "./components/statistics-section";
import StatisticsComponent from "./components/statistics";
import PageController from "./controllers/page.js";

import {generateFilms} from "./mock/film";
import {generateStatistics} from "./mock/statistics";

import {render} from "./utils/render.js";


const CARDS_COUNT = 6;

const films = generateFilms(CARDS_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const statistics = generateStatistics(films);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

render(headerContainer, new ProfileComponent(statistics).getElement());

const filterController = new FilterController(mainContainer, filmsModel);
filterController.render();


render(mainContainer, new StatisticsSectionComponent(statistics).getElement());

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

