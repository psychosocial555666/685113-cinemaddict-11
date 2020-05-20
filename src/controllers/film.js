import FilmComponent from "../components/film-card";
import PopupComponent from "../components/popup";
import FilmModel from "../models/film.js";


import {render, replace, remove} from "../utils/render.js";
import moment from "moment";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const bodyContainer = document.querySelector(`body`);

export default class FilmController {
  constructor(container, onDataChange, onViewChange, filmsModel, api) {
    this._container = container;
    this._filmComponent = null;
    this._popupComponent = null;
    this._filmsModel = filmsModel;
    this._api = api;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  _openPopup() {
    this._onViewChange();
    bodyContainer.appendChild(this._popupComponent.getElement());
    this._mode = Mode.EDIT;
  }

  _closePopup(film) {

    const newFilm = FilmModel.clone(film);
    newFilm.isInHistory = this._popupComponent._isInHistory;
    newFilm.isInFavorites = this._popupComponent._isInFavorites;
    newFilm.isInWatchlist = this._popupComponent._isInWatchlist;

    this._onDataChange(film, newFilm);
    bodyContainer.removeChild(this._popupComponent.getElement());
    this._mode = Mode.DEFAULT;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._filmComponent);
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;

    this._filmComponent = new FilmComponent(film);
    this._popupComponent = new PopupComponent(film, this._filmsModel, this._api);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        this._closePopup(film);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._filmComponent.setPosterClickHandler(() => {
      this._openPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._filmComponent.setTitleClickHandler(() => {
      this._openPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._filmComponent.setCommentsClickHandler(() => {
      this._openPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._popupComponent.setCloseButtonClick(() => {
      this._closePopup(film);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._filmComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.isInWatchlist = !newFilm.isInWatchlist;

      this._onDataChange(film, newFilm);
    });

    this._filmComponent.setHistoryButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.isInHistory = !newFilm.isInHistory;
      newFilm.watchingDate = moment();

      this._onDataChange(film, newFilm);
    });

    this._filmComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.isInFavorites = !newFilm.isInFavorites;

      this._onDataChange(film, newFilm);
    });


    if (oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmComponent .getElement());
    }
  }
}
