
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
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._showMoreComponent = new ShowMoreComponent();
    this._sortComponent = new SortComponent();

    this._renderFilms = this._renderFilms.bind(this);
    this._renderShowMoreButton = this._renderShowMoreButton.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._films = this._filmsModel.getFilms();
    this._topRatedFilms = [];
    this._mostComenetdFilms = [];

    this._showedFilmControllers = [];
    this._topRatedFilmsControllers = [];
    this._mostComenetdFilmsControllers = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);

    this._currentFilmsCount = SHOWING_CARDS_ON_START;
    this._filmsList = this._container.getElement().querySelector(`.films-list`);
    this._filmsListExtra = this._container.getElement().querySelectorAll(`.films-list--extra`);
    this._filmsListContaner = this._filmsList.querySelector(`.films-list__container`);
    this._filmsListRatedContaner = this._filmsListExtra[0].querySelector(`.films-list__container`);
    this._filmsListCommentedContaner = this._filmsListExtra[1].querySelector(`.films-list__container`);
  }


  render() {


    const films = this._films;

    render(this._container.getElement(), this._sortComponent.getElement(), RenderPosition.AFTERBEGIN);

    this._topRatedFilms = films.slice(0, films.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
    this._mostComenetdFilms = films.slice(0, films.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);

    this._showedFilmControllers = this._showedFilmControllers.concat(this._renderFilms(this._filmsListContaner, films.slice(0, this._currentFilmsCount), this._onDataChange));

    this._mostComenetdFilmsControllers = this._renderFilms(this._filmsListCommentedContaner, this._mostComenetdFilms, this._onDataChange);
    this._topRatedFilmsControllers = this._renderFilms(this._filmsListRatedContaner, this._topRatedFilms, this._onDataChange);

    this._renderShowMoreButton();


  }


  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }


  _updateFilms(count) {
    this._removeFilms();
    this._showedFilmControllers = this._showedFilmControllers.concat(this._renderFilms(this._filmsListContaner, this._filmsModel.getFilms().slice(0, count), this._onDataChange));
    remove(this._showMoreComponent);
    this._renderShowMoreButton();
  }


  _onFilterChange() {
    this._updateFilms(SHOWING_CARDS_ON_START);
  }


  _onSortTypeChange(sortType) {


    this._currentFilmsCount = SHOWING_CARDS_ON_BUTTON_CLICK;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType);

    this._filmsListContaner.innerHTML = ``;

    this._showedFilmControllers = this._renderFilms(this._filmsListContaner, sortedFilms.slice(0, this._currentFilmsCount), this._onDataChange);

    remove(this._showMoreComponent);
    this._renderShowMoreButton();


  }

  _renderFilms(filmsListElement, filmsArray, onDataChange, type) {


    return filmsArray.map((film) => {

      const filmController = new FilmController(filmsListElement, onDataChange, this._onViewChange, type);
      filmController.render(film);
      return filmController;

    });


  }


  _onDataChange(oldData, newData) {


    const showedController = this._showedFilmControllers.find((film) => film._filmComponent._film === oldData);
    const ratedController = this._topRatedFilmsControllers.find((film) => film._filmComponent._film === oldData);
    const commentedController = this._mostComenetdFilmsControllers.find((film) => film._filmComponent._film === oldData);

    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      if (showedController) {
        showedController.render(newData);
      }
      if (ratedController) {
        ratedController.render(newData);
      }
      if (commentedController) {
        commentedController.render(newData);
      }
    }


  }

  _onViewChange() {


    this._showedFilmControllers.forEach((it) => it.setDefaultView());


  }

  _renderShowMoreButton() {

    if (this._currentFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(this._filmsList, this._showMoreComponent.getElement());

    this._showMoreComponent.setClickHandler(() => {
      const prevFilmsCount = this._currentFilmsCount;
      this._currentFilmsCount = this._currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;
      this._showedFilmControllers = this._showedFilmControllers.concat(this._renderFilms(this._filmsListContaner, this._films.slice(prevFilmsCount, this._currentFilmsCount), this._onDataChange));

      if (this._currentFilmsCount >= this._films.length) {
        remove(this._showMoreComponent);
      }
    });


  }


}
