import AbstractSmartComponent from "./abstract-smart-component.js";

const createNavItem = (filter) => {
  const {name, count, checked} = filter;

  return (
    `<a href="#${name}" id = "${name}" class="main-navigation__item ${checked ? `main-navigation__item--active` : ``}">${name} ${name === `All movies` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createMainMenuTemplate = (filters) => {

  const navItems = filters.map((it) => createNavItem(it)).join(`\n`);

  return (
    `<nav class="main-navigation">
          <div class="main-navigation__items">
            ${navItems}
          </div>
          <a href="#stats" id = "Stats" class="main-navigation__additional">Stats</a>
        </nav>`
  );
};

export default class MainNav extends AbstractSmartComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._filterChangeHandler = null;
    this._statChangeHandler = null;
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters);
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
    this.setStatChangeHandler(this._statChangeHandler);
  }

  rerender() {
    super.rerender();
  }

  setStatChangeHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
      this._statChangeHandler = handler;
    });
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((it) => {
      it.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const filterName = evt.target.id;
        handler(filterName);
        this._filterChangeHandler = handler;
      });
    });
  }
}
