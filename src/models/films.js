import {FilterType} from "../controllers/filter.js";
import {getfilmsByFilter} from "../utils/filter.js";

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilms() {
    return getfilmsByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeComment(id) {
    this._films.forEach((film) => {
      let comments = film.comments;
      const index = comments.findIndex((it) => it.id === id);

      if (index === -1) {
        return false;
      }

      comments = [].concat(comments.slice(0, index), comments.slice(index + 1));

      this._callHandlers(this._dataChangeHandlers);

      return true;
    });
  }

  addComment(film) {
    this._films.comments = [].concat(film, this._films.comments);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
