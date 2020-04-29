import {transformTimeFormat} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createButtonMarkup = (name, title, isActive = false) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${name} ${isActive ? `` : `film-card__controls-item--active`}">${title}</button>`
  );
};

const createFilmCardTemplate = (film) => {
  const {title, rating, year, duration, genre, url, description, comments, isInWatchlist, isInHistory, isInFavorites} = film;

  const watchlistButton = createButtonMarkup(`add-to-watchlist`, `Add to watchlist`, !isInWatchlist);
  const historyButton = createButtonMarkup(`mark-as-watched`, `Mark as watched`, !isInHistory);
  const favoritesButton = createButtonMarkup(`favorite`, `Mark as favorite`, !isInFavorites);

  return (
    `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${transformTimeFormat(duration)}</span>
            <span class="film-card__genre">${genre[0]}</span>
          </p>
          <img src="${url}" alt="" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            ${watchlistButton}
            ${historyButton}
            ${favoritesButton}
          </form>
        </article>`
  );
};

export default class Film extends AbstractComponent {
  constructor(film) {

    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._index);
  }

  setPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
    .addEventListener(`click`, handler);
  }

  setTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
    .addEventListener(`click`, handler);
  }

  setCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
    .addEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setHistoryButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}

