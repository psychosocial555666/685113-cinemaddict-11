import FilterComponent from "../components/main-nav.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getfilmsByFilter} from "../utils/filter.js";

export const FilterType = {
  ALL: `All movies`,
  WATHCLIST: `Watchlis`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._statsClickHandler = null;
    this._filtersClickHandler = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allfilms = this._filmsModel.getFilmsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getfilmsByFilter(allfilms, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }

  recoveryFilterListeners() {
    this.setFiltersClickHandler(this._filtersClickHandler);
    this.setStatsClickHandler(this._statsClickHandler);
  }

  setStatsClickHandler(handler) {
    this._filterComponent.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
      this._statsClickHandler = handler;
    });

  }

  setFiltersClickHandler(handler) {
    this._filterComponent.getElement().querySelectorAll(`.main-navigation__item`).forEach((it) => {
      it.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
    });
    this._filtersClickHandler = handler;
  }
}
