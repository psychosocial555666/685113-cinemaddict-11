import AbstractComponent from "./abstract-component.js";

const createNavItem = (filter) => {
  const {name, count, checked} = filter;

  return (
    `<a href="#${name}" id = "${name}" class="main-navigation__item ${checked ? `main-navigation__item--active` : ``}">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMainMenuTemplate = (filters) => {

  const navItems = filters.map((it) => createNavItem(it)).join(`\n`);

  return (
    `<nav class="main-navigation">
          <div class="main-navigation__items">
            ${navItems}
          </div>
          <a href="#stats" class="main-navigation__additional">Stats</a>
        </nav>`
  );
};

export default class MainNav extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const filterName = evt.target.id;
      handler(filterName);
    });
  }
}
