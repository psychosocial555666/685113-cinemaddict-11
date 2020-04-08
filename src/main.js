import {createProfileRateTemplate} from "./components/profile";
import {createMainMenuTemplate} from "./components/main-nav";
import {createSortTemplate} from "./components/sort";
import {createFilmsTemplate} from "./components/films";
import {createFilmCardTemplate} from "./components/film-card";
import {createShowMoreTemplate} from "./components/show-more";
import {generateFilters} from "./mock/filter";
import {generateFilms} from "./mock/film";
// import {createPopupTemplate} from "./components/popup";

const CARDS_COUNT = 22;
const CARDS_EXTRA_COUNT = 2;
const SHOWING_CARDS_ON_START = 5;
const SHOWING_CARDS_ON_BUTTON_CLICK = 5;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
const filters = generateFilters();

// const bodyContainer = document.querySelector(`body`);
const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

render(headerContainer, createProfileRateTemplate());
render(mainContainer, createMainMenuTemplate(filters));
render(mainContainer, createSortTemplate());
render(mainContainer, createFilmsTemplate());

const filmsList = mainContainer.querySelector(`.films-list`);
const filmsListExtra = mainContainer.querySelectorAll(`.films-list--extra`);
const filmsListContaner = filmsList.querySelector(`.films-list__container`);
const filmsListRatedContaner = filmsListExtra[0].querySelector(`.films-list__container`);
const filmsListCommentedContaner = filmsListExtra[1].querySelector(`.films-list__container`);

let currentFilmsCount = SHOWING_CARDS_ON_START;

const films = generateFilms(CARDS_COUNT);
const ratedfilms = generateFilms(CARDS_EXTRA_COUNT);
const commentedfilms = generateFilms(CARDS_EXTRA_COUNT);

films.slice(0, currentFilmsCount).forEach((film) => (render(filmsListContaner, createFilmCardTemplate(film))));

render(filmsList, createShowMoreTemplate());

for (let j = 0; j < ratedfilms.length; j++) {
  render(filmsListRatedContaner, createFilmCardTemplate(ratedfilms[j]));
}
for (let k = 0; k < commentedfilms.length; k++) {
  render(filmsListCommentedContaner, createFilmCardTemplate(commentedfilms[k]));
}

const showMoreButton = filmsList.querySelector(`.films-list__show-more`);

showMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = currentFilmsCount;
  currentFilmsCount = currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;

  films.slice(prevFilmsCount, currentFilmsCount).forEach((film) => (render(filmsListContaner, createFilmCardTemplate(film))));

  if (currentFilmsCount >= films.length) {
    showMoreButton.remove();
  }
});
// render(bodyContainer, createPopupTemplate());

