import {createProfileRateTemplate} from "./components/profile";
import {createMainMenuTemplate} from "./components/main-nav";
import {createSortTemplate} from "./components/sort";
import {createFilmsTemplate} from "./components/films";
import {createFilmCardTemplate} from "./components/film-card";
import {createShowMoreTemplate} from "./components/show-more";
import {generateFilters} from "./mock/filter";
import {generateFilms} from "./mock/film";
import {createPopupTemplate} from "./components/popup";
import {createStatisticsTemplate} from "./components/statistics";
import {generateStatistics} from "./mock/statistics";
import {createStatisticsSectionTemplate} from "./components/statistics-section";


const CARDS_COUNT = 25;
const CARDS_EXTRA_COUNT = 2;
const SHOWING_CARDS_ON_START = 5;
const SHOWING_CARDS_ON_BUTTON_CLICK = 5;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
const films = generateFilms(CARDS_COUNT);
const filters = generateFilters(films);
const statistics = generateStatistics(films);

const bodyContainer = document.querySelector(`body`);
const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

render(headerContainer, createProfileRateTemplate(statistics));
render(mainContainer, createMainMenuTemplate(filters));
render(mainContainer, createStatisticsSectionTemplate(statistics));
render(mainContainer, createSortTemplate());
render(mainContainer, createFilmsTemplate());

const filmsList = mainContainer.querySelector(`.films-list`);
const filmsListExtra = mainContainer.querySelectorAll(`.films-list--extra`);
const filmsListContaner = filmsList.querySelector(`.films-list__container`);
const filmsListRatedContaner = filmsListExtra[0].querySelector(`.films-list__container`);
const filmsListCommentedContaner = filmsListExtra[1].querySelector(`.films-list__container`);

let currentFilmsCount = SHOWING_CARDS_ON_START;

const mostRatedFilms = films.slice(0, films.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
const mostCommentedFilms = films.slice(0, films.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);

films.slice(0, currentFilmsCount).forEach((film, i) => {
  (render(filmsListContaner, createFilmCardTemplate(film, i)));
});

render(filmsList, createShowMoreTemplate());

mostRatedFilms.forEach((film, i) => {
  (render(filmsListRatedContaner, createFilmCardTemplate(film, i)));
});

mostCommentedFilms.forEach((film, i) => {
  (render(filmsListCommentedContaner, createFilmCardTemplate(film, i)));
});

const showMoreButton = filmsList.querySelector(`.films-list__show-more`);

showMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = currentFilmsCount;
  currentFilmsCount = currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;

  films.slice(prevFilmsCount, currentFilmsCount).forEach((film, i) => (render(filmsListContaner, createFilmCardTemplate(film, i + currentFilmsCount - SHOWING_CARDS_ON_START))));

  const filmCards = filmsListContaner.querySelectorAll(`.film-card__poster`);

  openDetailsPopup(filmCards, films);

  if (currentFilmsCount >= films.length) {
    showMoreButton.remove();
  }
});

const filmCards = filmsListContaner.querySelectorAll(`.film-card__poster`);
const ratedFilmCards = filmsListRatedContaner.querySelectorAll(`.film-card__poster`);
const commentedFilmCards = filmsListCommentedContaner.querySelectorAll(`.film-card__poster`);

const openDetailsPopup = (list, array) => {
  list.forEach((card) => {
    card.addEventListener(`click`, (evt) => {
      render(bodyContainer, createPopupTemplate(array[evt.target.id]));

      const popup = document.querySelector(`.film-details`);
      const closeButton = popup.querySelector(`.film-details__close-btn`);

      closeButton.addEventListener(`click`, () => popup.remove());
    });
  });
};

openDetailsPopup(filmCards, films);
openDetailsPopup(ratedFilmCards, mostRatedFilms);
openDetailsPopup(commentedFilmCards, mostCommentedFilms);

const pageFooterContainer = document.querySelector(`.footer`);
const footerStaticticsContainer = pageFooterContainer.querySelector(`.footer__statistics`);

render(footerStaticticsContainer, createStatisticsTemplate(films.length));

export {films};

