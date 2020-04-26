
import ShowMoreComponent from "../components/show-more";
import SortComponent, {SortType} from "../components/sort";
import FilmController from "./film.js";

import {render, remove, RenderPosition} from "../utils/render.js";

const CARDS_EXTRA_COUNT = 2;
const SHOWING_CARDS_ON_START = 5;
const SHOWING_CARDS_ON_BUTTON_CLICK = 5;


const getSortedFilms = (filmsArray, sortType) => {
  let sortedFilms = [];
  const showingFilms = filmsArray.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.year - a.year);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }
  return sortedFilms;
};

const TypeFilm = {
  ALL: `TypeFilm.All`,
  MOST_COMMENTED: `TypeFilm.MOST_COMMENTED`,
  TOP_RATED: `TypeFilm.TOP_RATED`,
};


export default class PageController {
  constructor(container) {
    this._container = container;
    this._showMoreComponent = new ShowMoreComponent();
    this._sortComponent = new SortComponent();
    this._renderFilms = this._renderFilms.bind(this);
    this._renderShowMoreButton = this._renderShowMoreButton.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._films = [];
    this._topRatedFilms = [];
    this._mostComenetdFilms = [];

    this._showedFilmControllers = [];
    this._topRatedFilmsControllers = [];
    this._mostComenetdFilmsControllers = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._currentFilmsCount = SHOWING_CARDS_ON_START;
    this._filmsList = this._container.getElement().querySelector(`.films-list`);
    this._filmsListExtra = this._container.getElement().querySelectorAll(`.films-list--extra`);
    this._filmsListContaner = this._filmsList.querySelector(`.films-list__container`);
    this._filmsListRatedContaner = this._filmsListExtra[0].querySelector(`.films-list__container`);
    this._filmsListCommentedContaner = this._filmsListExtra[1].querySelector(`.films-list__container`);
  }

  render(films) {
    this._films = films;

    render(this._container.getElement(), this._sortComponent.getElement(), RenderPosition.AFTERBEGIN);

    this._topRatedFilms = this._films.slice(0, this._films.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
    this._mostComenetdFilms = this._films.slice(0, this._films.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);

    this._showedFilmControllers = this._showedFilmControllers.concat(this._renderFilms(this._filmsListContaner, this._films.slice(0, this._currentFilmsCount), this._onDataChange, TypeFilm.ALL));

    this._mostComenetdFilmsControllers = this._renderFilms(this._filmsListCommentedContaner, this._mostComenetdFilms, this._onDataChange, TypeFilm.MOST_COMMENTED);
    this._topRatedFilmsControllers = this._renderFilms(this._filmsListRatedContaner, this._topRatedFilms, this._onDataChange, TypeFilm.TOP_RATED);

    this._renderShowMoreButton(this._films);
  }

  _onSortTypeChange(sortType) {
    this._currentFilmsCount = SHOWING_CARDS_ON_BUTTON_CLICK;

    const sortedFilms = getSortedFilms(this._films, sortType);

    this._filmsListContaner.innerHTML = ``;

    const newFilms = this._renderFilms(this._filmsListContaner, sortedFilms.slice(0, this._currentFilmsCount), this._onDataChange);
    this._showedFilmControllers = newFilms;

    remove(this._showMoreComponent);
    this._renderShowMoreButton(sortedFilms);
  }

  _renderFilms(filmsListElement, filmsArray, onDataChange, type) {
    return filmsArray.map((film) => {

      const filmController = new FilmController(filmsListElement, onDataChange, this._onViewChange, type);
      filmController.render(film);
      return filmController;

    });
  }


  _onDataChange(oldData, newData, type) {
    let controllers;
    let keyFilms;

    switch (type) {
      case TypeFilm.ALL:
        controllers = this._showedFilmControllers;
        keyFilms = `_films`;
        break;
      case TypeFilm.TOP_RATED:
        controllers = this._topRatedFilmsControllers;
        keyFilms = `_topRatedFilms`;
        break;
      case TypeFilm.MOST_COMMENTED:
        controllers = this._mostComenetdFilmsControllers;
        keyFilms = `_mostComenetdFilms`;
        break;
    }
    this._onAnyDataChange(controllers, keyFilms, oldData, newData);
  }

  _onAnyDataChange(controllers, keyFilms, oldData, newData) {
    const films = this[keyFilms];
    const index = films.findIndex((it) => it === oldData);
    const controller = controllers.find((film) => film._filmComponent._film === oldData);
    if (index === -1) {
      return;
    }
    this[keyFilms] = [...films.slice(0, index), newData, ...films.slice(index + 1)];
    controller.render(newData);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _renderShowMoreButton(filmsArray) {
    if (this._currentFilmsCount >= filmsArray.length) {
      return;
    }

    render(this._filmsList, this._showMoreComponent.getElement());

    this._showMoreComponent.setClickHandler(() => {
      const prevFilmsCount = this._currentFilmsCount;
      this._currentFilmsCount = this._currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;

      const newFilms = this._renderFilms(this._filmsListContaner, filmsArray.slice(prevFilmsCount, this._currentFilmsCount), this._onDataChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._currentFilmsCount >= filmsArray.length) {
        remove(this._showMoreComponent);
      }
    });
  }
}
