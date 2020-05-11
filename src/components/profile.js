import AbstractComponent from "./abstract-component.js";
import {getUserRating} from "../utils/common.js";

const createProfileRateTemplate = (films) => {
  const watchedMovies = films.filter((it)=> it.isInHistory);
  const rating = getUserRating(watchedMovies);
  const avatar = `images/bitmap@2x.png`;

  return (
    `<section class="header__profile profile">
          <p class="profile__rating">${rating}</p>
          <img class="profile__avatar" src=${avatar} alt="Avatar" width="35" height="35">
      </section>`
  );
};


export default class Profile extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createProfileRateTemplate(this._films);
  }
}

