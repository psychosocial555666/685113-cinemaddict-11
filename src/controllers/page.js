
import ShowMoreComponent from "../components/show-more";
import SortComponent, {SortType} from "../components/sort";
import FilmController from "./film.js";
import ProfileComponent from "../components/profile";
import StatisticsSectionComponent from "../components/statistics-section";
import StatisticsComponent from "../components/statistics";
import FilterController from "./filter.js";
// import NoFilmsComponent from "../components/no-films";


import {render, remove, RenderPosition} from "../utils/render.js";

const CARDS_EXTRA_COUNT = 2;
const SHOWING_CARDS_ON_START = 5;
const SHOWING_CARDS_ON_BUTTON_CLICK = 5;

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footerStaticticsContainer = document.querySelector(`.footer__statistics`);


const getSortedFilms = (filmsArray, sortType, from, to) => {
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
  return sortedFilms.slice(from, to);
};


export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;

    this._showMoreComponent = new ShowMoreComponent();
    this._sortComponent = new SortComponent();
    this._profileComponent = null;
    this._statisticsSectionComponent = null;
    this._statisticsComponent = null;
    this._filterController = null;

    this._renderFilms = this._renderFilms.bind(this);
    this._renderShowMoreButton = this._renderShowMoreButton.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

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

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {
    const films = this._filmsModel.getFilms();

    this._profileComponent = new ProfileComponent(this._filmsModel.getFilms());
    this._statisticsSectionComponent = new StatisticsSectionComponent(this._filmsModel.getFilms());
    this._statisticsComponent = new StatisticsComponent(this._filmsModel.getFilms().length);
    this._filterController = new FilterController(mainContainer, this._filmsModel, this, this._statisticsSectionComponent);

    render(this._container.getElement(), this._sortComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(headerContainer, this._profileComponent.getElement());
    render(mainContainer, this._statisticsSectionComponent.getElement());
    this._statisticsSectionComponent.hide();
    render(footerStaticticsContainer, this._statisticsComponent.getElement());

    this._filterController.render();

    this._topRatedFilms = films.slice(0, films.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
    this._mostComenetdFilms = films.slice(0, films.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);

    this._showedFilmControllers = this._showedFilmControllers.concat(this._renderFilms(this._filmsListContaner, films.slice(0, this._currentFilmsCount)));

    this._mostComenetdFilmsControllers = this._renderFilms(this._filmsListCommentedContaner, this._mostComenetdFilms);
    this._topRatedFilmsControllers = this._renderFilms(this._filmsListRatedContaner, this._topRatedFilms);

    this._renderShowMoreButton();
  }


  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }


  _updateFilms(count) {
    this._removeFilms();
    this._showedFilmControllers = this._showedFilmControllers.concat(this._renderFilms(this._filmsListContaner, this._filmsModel.getFilms().slice(0, count)));
    remove(this._showMoreComponent);
    this._renderShowMoreButton();
  }


  _onFilterChange() {
    this._currentFilmsCount = SHOWING_CARDS_ON_START;
    this._updateFilms(SHOWING_CARDS_ON_START);
    remove(this._sortComponent);
    this._sortComponent.removeElement();
    this._sortComponent = new SortComponent();
    render(this._container.getElement(), this._sortComponent.getElement(), RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }


  _onSortTypeChange(sortType) {
    remove(this._showMoreComponent);

    this._currentFilmsCount = SHOWING_CARDS_ON_BUTTON_CLICK;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType);

    this._removeFilms();

    this._showedFilmControllers = this._renderFilms(this._filmsListContaner, sortedFilms.slice(0, this._currentFilmsCount));


    this._renderShowMoreButton();
  }

  _renderFilms(filmsListElement, filmsArray) {
    return filmsArray.map((film) => {

      const filmController = new FilmController(filmsListElement, this._onDataChange, this._onViewChange, this._filmsModel.getFilms(), this._api);
      filmController.render(film);
      return filmController;
    });
  }


  _onDataChange(oldData, newData) {
    const showedController = this._showedFilmControllers.find((film) => film._filmComponent._film === oldData);
    const ratedController = this._topRatedFilmsControllers.find((film) => film._filmComponent._film === oldData);
    const commentedController = this._mostComenetdFilmsControllers.find((film) => film._filmComponent._film === oldData);


    this._api.updateFilm(oldData.id, newData)
        .then((filmModel) => {
          const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);

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
          remove(this._profileComponent);
          this._profileComponent.removeElement();
          this._profileComponent = new ProfileComponent(this._filmsModel.getFilms());
          render(headerContainer, this._profileComponent.getElement());

          remove(this._statisticsSectionComponent);
          this._statisticsSectionComponent.removeElement();
          this._statisticsSectionComponent = new StatisticsSectionComponent(this._filmsModel.getFilms());
          render(mainContainer, this._statisticsSectionComponent.getElement());
          this._statisticsSectionComponent.hide();

          this._filterController.destroy();
          this._filterController = null;
          this._filterController = new FilterController(mainContainer, this._filmsModel, this, this._statisticsSectionComponent);
          this._filterController.render();
        });

  }


  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }


  _renderShowMoreButton() {
    if (this._currentFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(this._filmsList, this._showMoreComponent.getElement());

    this._showMoreComponent.setClickHandler(this._onShowMoreButtonClick);
  }


  _onShowMoreButtonClick() {
    const prevFilmsCount = this._currentFilmsCount;
    const films = this._filmsModel.getFilms();

    this._currentFilmsCount = this._currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmsCount, this._currentFilmsCount);

    this._showedFilmControllers = this._showedFilmControllers.concat(this._renderFilms(this._filmsListContaner, sortedFilms));

    if (this._currentFilmsCount >= films.length) {
      remove(this._showMoreComponent);
    }
  }
}
