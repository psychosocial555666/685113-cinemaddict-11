import {createElement} from "../utils";

const createNavItem = (name, count) => {
  return (
    `<a href="#${name.toLowerCase()}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMainMenuTemplate = (filters) => {

  const navItems = filters.map((it) => createNavItem(it.name, it.count)).join(`\n`);

  return (
    `<nav class="main-navigation">
          <div class="main-navigation__items">
            <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
            ${navItems}
          </div>
          <a href="#stats" class="main-navigation__additional">Stats</a>
        </nav>`
  );
};

export default class MainNav {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters);
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
