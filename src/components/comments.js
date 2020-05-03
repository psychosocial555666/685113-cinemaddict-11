import AbstractComponent from "./abstract-component.js";

const createCommentsTemplate = (film) => {
  const commentItems = film.comments.map((it) => createCommentItem(it.smile, it.author, it.text, it.date, it.id)).join(`\n`);
  let emotionImage = ``;

  if (film.emotion) {
    emotionImage = createEmotionMarkup(film.emotion);
  }


  return `<section class="film-details__comments-wrap">
                <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>
        
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

const createEmotionMarkup = (emotion) => {
  return (
    `<img src=${emotion} width="55" height="55" alt="">`
  );
};
export default class Comments extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createCommentsTemplate(this._film);
  }
}