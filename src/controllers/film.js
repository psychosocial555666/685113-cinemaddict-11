import FilmComponent from "../components/film-card";
import PopupComponent from "../components/popup";


import {render, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const bodyContainer = document.querySelector(`body`);

export default class FilmController {
  constructor(container, onDataChange, onViewChange, typeFilm) {
    this._container = container;
    this._filmComponent = null;
    this._popupComponent = null;
    this._typeFilm = typeFilm;

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
    this._onDataChange(film, Object.assign({}, film, {
      isInHistory: this._popupComponent._isInHistory,
      isInFavorites: this._popupComponent._isInFavorites,
      isInWatchlist: this._popupComponent._isInWatchlist
    }), this._typeFilm);
    bodyContainer.removeChild(this._popupComponent.getElement());
    this._mode = Mode.DEFAULT;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmComponent = new FilmComponent(film);
    this._popupComponent = new PopupComponent(film);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        this._closePopup(film);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // Обработчики открытия попапа

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

    // Закрытие попапа

    this._popupComponent.setCloseButtonClick(() => {
      this._closePopup(film);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    // Обработчики клика по кнопкам добавления категорий

    this._filmComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
        isInWatchlist: !film.isInWatchlist,
      }), this._typeFilm);
    });

    this._filmComponent.setHistoryButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
        isInHistory: !film.isInHistory,
      }), this._typeFilm);
    });

    this._filmComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
        isInFavorites: !film.isInFavorites,
      }), this._typeFilm);
    });

    // Замена старых компонент на новые

    if (oldFilmComponent && oldPopupComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container, this._filmComponent .getElement());
    }
  }
}
