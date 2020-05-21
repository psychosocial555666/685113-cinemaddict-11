import AbstractSmartComponent from "./abstract-smart-component.js";

export const SortType = {
  DATE: `date`,
  RATING: `rating`,
  DEFAULT: `default`,
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
        <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
        <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
        <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
      </ul>`
  );
};

export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();

    this._sortTypeChangeHandler = null;

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getType() {
    return this._currenSortType;
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  rerender() {
    super.rerender();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      this.getElement().querySelectorAll(`.sort__button`).forEach((element) => {
        element.classList.remove(`sort__button--active`);
      });

      evt.target.classList.add(`sort__button--active`);

      handler(this._currenSortType);
      this._sortTypeChangeHandler = handler;
    });
  }
}
