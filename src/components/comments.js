import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from "moment";
import CommentsModel from "../models/comments";
import api from "./../api.js";

const createCommentsTemplate = (film) => {
  const commentItems = film.commentsAll.map((it) => createCommentItem(it.smile, it.author, it.text, it.date, it.id)).join(`\n`);
  let emotionImage = ``;

  if (film.emotion) {
    emotionImage = createEmotionMarkup(film.emotion);
  }

  return `<section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.commentsAll.length}</span></h3>

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
          </section>`;
};


const createCommentItem = (smile, author, text, date, id) => {
  return (
    `<li class="film-details__comment" data-id = ${id} >
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${smile}.png" width="55" height="55" alt="emoji-${smile}">
          </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${moment(date).calendar(null, {sameElse: `YYYY/MM/DD hh:mm`})}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
  );
};

const createEmotionMarkup = (emotion) => {
  return (
    `<img src=${emotion} width="55" height="55" alt="">`
  );
};

export default class CommentsComponent extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._initialized = false;
  }

  getComments() {
    return this._initialized ? Promise.resolve() : new Promise((res) => {
      api.getComments(this._film .id).then((data) => {
        this._film.commentsAll = data;
        this._subscribeOnEvents();
        this._initialized = true;
        res();
      });
    });
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const form = element.querySelector(`.film-details__new-comment`);

    element.querySelectorAll(`.film-details__comment-delete`).forEach((it) => {
      it.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const id = evt.target.closest(`.film-details__comment`).dataset.id;
        this._onDataChange({id}, null);
      });
    });

    form.addEventListener(`change`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        form.querySelector(`.film-details__add-emoji-label`)
           .innerHTML = `<img src="./images/emoji/${evt.target.value}.png" width="30" height="30" alt="emoji">`;
      }
    }, false);

    form.addEventListener(`keydown`, (evt) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.code === `Enter`) {
        this._onDataChange(null, new FormData(this._element.closest(`.film-details__inner`)));
      }
    });
  }

  _onDataChange(oldData, newData) {
    if (oldData === null) {
      const comment = newData.get(`comment`);
      const emotion = newData.get(`comment-emoji`);
      if (comment && emotion) {
        const commentItem = {
          comment, emotion,
          date: new Date().toISOString(),
        };
        const newComment = CommentsModel.clone(commentItem);
        api.createComment(newComment, this._film.id)
        .then(this.rerender());
      }
    } else if (newData === null) {
      const deletingComment = this._film.commentsAll.find((comment) => comment.id === oldData.id);
      const index = this._film.commentsAll.indexOf(deletingComment);
      const idIndex = this._film.comments.indexOf(this._film.comments.find((comment) => comment === oldData.id));

      if (index > -1) {
        this._film.commentsAll = [...this._film.commentsAll.slice(0, index), ...this._film.commentsAll.slice(index + 1)];
        this._film.comments = [...this._film.comments.slice(0, idIndex), ...this._film.comments.slice(idIndex + 1)];
      }
      api.deleteComment(deletingComment.id)
      .then(this.rerender());
    }
  }

  getTemplate() {
    return createCommentsTemplate(this._film);
  }

  rerender() {
    super.rerender();
  }
}
