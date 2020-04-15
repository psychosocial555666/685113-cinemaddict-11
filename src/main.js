import FilmComponent from "./components/film-card";
import FilmsComponent from "./components/films";
import MainNavComponent from "./components/main-nav";
import PopupComponent from "./components/popup";
import ProfileComponent from "./components/profile";
import ShowMoreComponent from "./components/show-more";
import SortComponent from "./components/sort";
import StatisticsSectionComponent from "./components/statistics-section";
import StatisticsComponent from "./components/statistics";

import {generateFilters} from "./mock/filter";
import {generateFilms} from "./mock/film";
import {generateStatistics} from "./mock/statistics";

import {render} from "./utils.js";


const CARDS_COUNT = 25;
const CARDS_EXTRA_COUNT = 2;
const SHOWING_CARDS_ON_START = 5;
const SHOWING_CARDS_ON_BUTTON_CLICK = 5;

const films = generateFilms(CARDS_COUNT);
const filters = generateFilters(films);
const statistics = generateStatistics(films);

const bodyContainer = document.querySelector(`body`);
const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

render(headerContainer, new ProfileComponent(statistics).getElement());
render(mainContainer, new MainNavComponent(filters).getElement());
render(mainContainer, new SortComponent().getElement());
// Отрисовка карточки фильма
const renderFilm = (filmElement, film) => {
  const onFilmCardClick = (evt) => {
    evt.preventDefault();
    bodyContainer.appendChild(popupComponent.getElement());
  };
  const onPopupCloseButtonClick = (evt) => {
    evt.preventDefault();
    bodyContainer.removeChild(popupComponent.getElement());
  };

  const filmComponent = new FilmComponent(film);
  const filmPoster = filmComponent.getElement().querySelector(`.film-card__poster`);
  const filmTitle = filmComponent.getElement().querySelector(`.film-card__title`);
  const filmComments = filmComponent.getElement().querySelector(`.film-card__comments`);
  filmPoster.addEventListener(`click`, onFilmCardClick);
  filmTitle.addEventListener(`click`, onFilmCardClick);
  filmComments.addEventListener(`click`, onFilmCardClick);

  const popupComponent = new PopupComponent(film);
  const closeButton = popupComponent.getElement().querySelector(`.film-details__close-btn`);
  closeButton.addEventListener(`click`, onPopupCloseButtonClick);

  render(filmElement, filmComponent.getElement());
};

// Отрисовка контейнера для карточек

const renderFilms = (filmsComponent, filmsArr) => {
  const filmsList = filmsComponent.getElement().querySelector(`.films-list`);
  const filmsListExtra = filmsComponent.getElement().querySelectorAll(`.films-list--extra`);
  const filmsListContaner = filmsList.querySelector(`.films-list__container`);
  const filmsListRatedContaner = filmsListExtra[0].querySelector(`.films-list__container`);
  const filmsListCommentedContaner = filmsListExtra[1].querySelector(`.films-list__container`);

  let currentFilmsCount = SHOWING_CARDS_ON_START;

  const mostRatedFilms = filmsArr.slice(0, filmsArr.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
  const mostCommentedFilms = filmsArr.slice(0, filmsArr.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);

  filmsArr.slice(0, currentFilmsCount).forEach((film) => {
    (renderFilm(filmsListContaner, film));
  });

  mostRatedFilms.forEach((film) => {
    (renderFilm(filmsListRatedContaner, film));
  });

  mostCommentedFilms.forEach((film) => {
    (renderFilm(filmsListCommentedContaner, film));
  });

  const showMoreComponent = new ShowMoreComponent();

  render(filmsList, showMoreComponent.getElement());
  const showMoreButton = filmsList.querySelector(`.films-list__show-more`);
  showMoreButton.addEventListener(`click`, () => {
    const prevFilmsCount = currentFilmsCount;
    currentFilmsCount = currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;

    filmsArr.slice(prevFilmsCount, currentFilmsCount).forEach((film) => (renderFilm(filmsListContaner, film)));

    if (currentFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
};


const filmsComponent = new FilmsComponent();
render(mainContainer, filmsComponent.getElement());
renderFilms(filmsComponent, films);
render(mainContainer, new StatisticsSectionComponent(statistics).getElement());

const footerStaticticsContainer = document.querySelector(`.footer__statistics`);

render(footerStaticticsContainer, new StatisticsComponent(films.length).getElement());

