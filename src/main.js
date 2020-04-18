import FilmsComponent from "./components/films";
import MainNavComponent from "./components/main-nav";
import NoFilmsComponent from "./components/no-films";
import ProfileComponent from "./components/profile";
import SortComponent from "./components/sort";
import StatisticsSectionComponent from "./components/statistics-section";
import StatisticsComponent from "./components/statistics";
import PageController from "./controllers/page.js";

import {generateFilters} from "./mock/filter";
import {generateFilms} from "./mock/film";
import {generateStatistics} from "./mock/statistics";

import {render} from "./utils/render.js";


const CARDS_COUNT = 25;

const films = generateFilms(CARDS_COUNT);
const filters = generateFilters(films);
const statistics = generateStatistics(films);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

render(headerContainer, new ProfileComponent(statistics).getElement());
render(mainContainer, new MainNavComponent(filters).getElement());
render(mainContainer, new SortComponent().getElement());
render(mainContainer, new StatisticsSectionComponent(statistics).getElement());

const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent);

if (films.length === 0) {
  render(mainContainer, new NoFilmsComponent().getElement());
} else {
  render(mainContainer, filmsComponent.getElement());
  pageController.render(films);
}

const footerStaticticsContainer = document.querySelector(`.footer__statistics`);

render(footerStaticticsContainer, new StatisticsComponent(films.length).getElement());

