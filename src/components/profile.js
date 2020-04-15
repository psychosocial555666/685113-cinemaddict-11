import {createElement} from "../utils";

const createProfileRateTemplate = (user) => {
  return (
    `<section class="header__profile profile">
          <p class="profile__rating">${user.rating}</p>
          <img class="profile__avatar" src=${user.avatar} alt="Avatar" width="35" height="35">
      </section>`
  );
};


export default class Profile {
  constructor(user) {
    this._user = user;

    this._element = null;
  }

  getTemplate() {
    return createProfileRateTemplate(this._user);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

