
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


export default class PageController {
  constructor(container) {
    this._container = container;
    this._showMoreComponent = new ShowMoreComponent();
    this._sortComponent = new SortComponent();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._renderFilms = this._renderFilms.bind(this);
    this._renderShowMoreButton = this._renderShowMoreButton.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._films = [];
    this._showedFilmControllers = [];

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

    const mostRatedFilms = this._films.slice(0, this._films.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
    const mostCommentedFilms = this._films.slice(0, this._films.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);

    const newFilms = this._renderFilms(this._filmsListContaner, this._films.slice(0, this._currentFilmsCount), this._onDataChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._renderFilms(this._filmsListRatedContaner, mostRatedFilms, this._onDataChange);

    this._renderFilms(this._filmsListCommentedContaner, mostCommentedFilms, this._onDataChange);

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

  _renderFilms(filmsListElement, filmsArray, onDataChange) {
    return filmsArray.map((film) => {
      const filmController = new FilmController(filmsListElement, onDataChange, this._onViewChange);

      filmController.render(film);

      return filmController;
    });
  }

  _onDataChange(filmController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    filmController.render(newData);
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
