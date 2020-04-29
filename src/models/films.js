export default class Films {
  constructor() {
    this._films = [];

    this._dataChangeHandlers = [];
  }

  getFilms() {
    return this._films;
  }

  setFilms(tasks) {
    this._films = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(id, task) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), task, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
