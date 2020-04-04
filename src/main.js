import {createProfileRateTemplate} from "./components/profile";
import {createMainMenuTemplate} from "./components/main-nav";
import {createSortTemplate} from "./components/sort";
import {createFilmsTemplate} from "./components/films";
import {createFilmCardTemplate} from "./components/film-card";
import {createShowMoreTemplate} from "./components/show-more";
// import {createPopupTemplate} from "./components/popup";

const CARDS_COUNT = 5;
const CARDS_EXTRA_COUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

// const bodyContainer = document.querySelector(`body`);
const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

render(headerContainer, createProfileRateTemplate());
render(mainContainer, createMainMenuTemplate());
render(mainContainer, createSortTemplate());
render(mainContainer, createFilmsTemplate());

const filmsList = mainContainer.querySelector(`.films-list`);
const filmsListExtra = mainContainer.querySelectorAll(`.films-list--extra`);
const filmsListContaner = filmsList.querySelector(`.films-list__container`);
const filmsListRatedContaner = filmsListExtra[0].querySelector(`.films-list__container`);
const filmsListCommentedContaner = filmsListExtra[1].querySelector(`.films-list__container`);

for (let i = 0; i < CARDS_COUNT; i++) {
  render(filmsListContaner, createFilmCardTemplate());
}

render(filmsList, createShowMoreTemplate());

for (let i = 0; i < CARDS_EXTRA_COUNT; i++) {
  render(filmsListRatedContaner, createFilmCardTemplate());
}
for (let i = 0; i < CARDS_EXTRA_COUNT; i++) {
  render(filmsListCommentedContaner, createFilmCardTemplate());
}

// render(bodyContainer, createPopupTemplate());

