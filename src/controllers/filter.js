import FilterComponent from "../components/main-nav.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {getfilmsByFilter} from "../utils/filter.js";

export const FilterType = {
  ALL: `All movies`,
  WATHCLIST: `Watchlis`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

const Screens = {
  STATISTICS: `Statistics`,
  FILMS: `Films`,
  SEARCH: `Search`
};


export default class FilterController {
  constructor(container, filmsModel, pageController, statisticsSectionComponent) {
    this._pageController = pageController;
    this._statisticsSectionComponent = statisticsSectionComponent;
    this._container = container;
    this._filmsModel = filmsModel;
    this._currentScreen = Screens.FILMS;
    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onStatChange = this._onStatChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  _updateScreen(screen) {
    if (screen === this._currentScreen) {
      return;
    }
    switch (screen) {
      case Screens.STATISTICS:
        this._statisticsSectionComponent.show();
        this._pageController.hide();
        document.querySelectorAll(`.main-navigation__item`).forEach((it) => {
          it.classList.remove(`main-navigation__item--active`);
        });
        document.querySelector(`.main-navigation__additional`).classList.add(`main-navigation__item--active`);
        break;
      case Screens.FILMS:
        this._statisticsSectionComponent.hide();
        this._pageController.show();
        document.querySelector(`.main-navigation__additional`).classList.remove(`main-navigation__item--active`);
        break;
    }
    this._currentScreen = screen;
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
    this._filterComponent.setStatChangeHandler(this._onStatChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement(), RenderPosition.AFTERBEGIN);
    }
  }

  _onStatChange() {
    this._updateScreen(Screens.STATISTICS);
  }

  _onFilterChange(filterType) {
    this._updateScreen(Screens.FILMS);
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }

  destroy() {
    remove(this._filterComponent);
  }

  recoveryFilterListener() {
    this.setFiltersClickHandler(this._filtersClickHandler);
  }

  recoveryStatsListener() {
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
