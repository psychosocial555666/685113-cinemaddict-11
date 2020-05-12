import Film from "./models/film.js";

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict`, {headers})
      .then((response) => response.json())
      .then(Film.parseFilms);
  }
};

export default API;
