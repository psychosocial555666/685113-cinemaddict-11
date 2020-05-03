import {transformTimeFormat} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import CommentsController from "../controllers/comments.js";

const createGenreItem = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};

const createCheckboxMarkup = (name, title, isActive = false) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isActive ? `` : `checked`}>
     <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${title}</label>`
  );
};

const createPopupTemplate = (film, comments) => {
  const {title, rating, year, duration, genre, url, description, age, director, writers, actors, release, country} = film;


  const watchlistInput = createCheckboxMarkup(`watchlist`, `Add to watchlist`, !film.isInWatchlist);
  const historyInput = createCheckboxMarkup(`watched`, `Allready watched`, !film.isInHistory);
  const favoritesInput = createCheckboxMarkup(`favorite`, `Add to favorites`, !film.isInFavorites);

  const genreItems = genre.map((it) => createGenreItem(it)).join(`\n`);

  return (
    `<section class="film-details">
          <form class="film-details__inner" action="" method="get">
            <div class="form-details__top-container">
              <div class="film-details__close">
                <button class="film-details__close-btn" type="button">close</button>
              </div>
              <div class="film-details__info-wrap">
                <div class="film-details__poster">
                  <img class="film-details__poster-img" src=${url} alt="">
        
                  <p class="film-details__age">${age}</p>
                </div>
        
                <div class="film-details__info">
                  <div class="film-details__info-head">
                    <div class="film-details__title-wrap">
                      <h3 class="film-details__title">${title}</h3>
                      <p class="film-details__title-original">Original: ${title}</p>
                    </div>
        
                    <div class="film-details__rating">
                      <p class="film-details__total-rating">${rating}</p>
                    </div>
                  </div>
        
                  <table class="film-details__table">
                    <tr class="film-details__row">
                      <td class="film-details__term">Director</td>
                      <td class="film-details__cell">${director}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Writers</td>
                      <td class="film-details__cell">${writers}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Actors</td>
                      <td class="film-details__cell">${actors}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Release Date</td>
                      <td class="film-details__cell">${release} ${year}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Runtime</td>
                      <td class="film-details__cell">${transformTimeFormat(duration)}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Country</td>
                      <td class="film-details__cell">${country}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
                      <td class="film-details__cell">
                        ${genreItems}
                      </td>
                    </tr>
                  </table>
        
                  <p class="film-details__film-description">
                  ${description}
                  </p>
                </div>
              </div>
        
              <section class="film-details__controls">
                ${watchlistInput}
                ${historyInput}
                ${favoritesInput}
              </section>
            </div>
        
            <div class="form-details__bottom-container">
            ${comments}
            </div>
          </form>
        </section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(film, filmsModel) {
    super();
    this._film = film;
    this._filmsModel = filmsModel;
    this._closeButtonHandler = null;
    this._deleteButtonClickHandler = null;
    this._commentsController = new CommentsController(this._filmsModel).render(film);

    this._subscribeOnEvents();

    this._isInFavorites = film.isInFavorites;
    this._isInWatchlist = film.isInWatchlist;
    this._isInHistory = film.isInHistory;
  }

  getTemplate() {
    return createPopupTemplate(this._film, this._commentsController);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setCloseButtonClick(this._closeButtonHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  rerender() {
    super.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, () => {
      this._isInWatchlist = !this._isInWatchlist;
    });
    element.querySelector(`.film-details__control-label--watched`).addEventListener(`click`, () => {
      this._isInHistory = !this._isInHistory;
    });
    element.querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, () => {
      this._isInFavorites = !this._isInFavorites;
    });

    element.querySelectorAll(`.film-details__emoji-label`).forEach((it) => {
      it.addEventListener(`click`, (evt) => {
        this._film.emotion = evt.target.src;
        this.rerender();
      });
    });
  }

  setCloseButtonClick(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, handler);
    this._closeButtonHandler = handler;
  }
}
