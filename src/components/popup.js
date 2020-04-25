import {transformTimeFormat} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";

const createGenreItem = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};

const createCommentItem = (smile, author, text, date) => {
  return (
    `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${smile}.png" width="55" height="55" alt="emoji-${smile}">
        </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCheckboxMarkup = (name, title, isActive = false) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isActive ? `` : `checked`}>
     <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${title}</label>`
  );
};

const createEmotionMarkup = (emotion) => {
  return (
    `<img src=${emotion} width="55" height="55" alt="">`
  );
};

const createPopupTemplate = (film) => {
  const {title, rating, year, duration, genre, url, description, comments, age, director, writers, actors, release, country, emotion} = film;

  const commentItems = film.comments.map((it) => createCommentItem(it.smile, it.author, it.text, it.date)).join(`\n`);
  const watchlistInput = createCheckboxMarkup(`watchlist`, `Add to watchlist`, !film.isInWatchlist);
  const historyInput = createCheckboxMarkup(`watched`, `Allready watched`, !film.isInHistory);
  const favoritesInput = createCheckboxMarkup(`favorite`, `Add to favorites`, !film.isInFavorites);

  const genreItems = genre.map((it) => createGenreItem(it)).join(`\n`);
  let emotionImage = ``;

  if (emotion) {
    emotionImage = createEmotionMarkup(emotion);
  }


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
              <section class="film-details__comments-wrap">
                <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        
                <ul class="film-details__comments-list">
                  ${commentItems}
                </ul>
        
                <div class="film-details__new-comment">
                  <div for="add-emoji" class="film-details__add-emoji-label">
                    ${emotionImage}
                  </div>

        
                  <label class="film-details__comment-label">
                    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                  </label>
        
                  <div class="film-details__emoji-list">
                    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                    <label class="film-details__emoji-label" for="emoji-smile">
                      <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                    </label>
        
                    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                    <label class="film-details__emoji-label" for="emoji-sleeping">
                      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                    </label>
        
                    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                    <label class="film-details__emoji-label" for="emoji-puke">
                      <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                    </label>
        
                    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                    <label class="film-details__emoji-label" for="emoji-angry">
                      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                    </label>
                  </div>
                </div>
              </section>
            </div>
          </form>
        </section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._closeButtonHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setCloseButtonClick(this._closeButtonHandler);
  }

  rerender() {
    super.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, () => {
      this._film.isInWatchlist = !this._film.isInWatchlist;
      this.rerender();
    });
    element.querySelector(`.film-details__control-label--watched`).addEventListener(`click`, () => {
      this._film.isInHistory = !this._film.isInHistory;
      this.rerender();
    });
    element.querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, () => {
      this._film.isInFavorites = !this._film.isInFavorites;
      this.rerender();
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
