import {transformTimeFormat} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createFilmCardTemplate = (film, index) => {
  const {title, rating, year, duration, genre, url, description, comments, isInWatchlist, isInHistory, isInFavorites} = film;
  const watchlistButtonClass = isInWatchlist ? `film-card__controls-item--active` : ``;
  const historyButtonClass = isInHistory ? `film-card__controls-item--active` : ``;
  const favoritesButtonClass = isInFavorites ? `film-card__controls-item--active` : ``;

  return (
    `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${transformTimeFormat(duration)}</span>
            <span class="film-card__genre">${genre[0]}</span>
          </p>
          <img src="${url}" alt="" id="${index}" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistButtonClass}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${historyButtonClass}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favoritesButtonClass}">Mark as favorite</button>
          </form>
        </article>`
  );
};

export default class Film extends AbstractComponent {
  constructor(film, index) {
    super();
    this._index = index;
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
}

