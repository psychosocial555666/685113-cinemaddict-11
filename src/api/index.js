import Film from "../models/film.js";
import Comments from "../models/comments";

const AUTHORIZATION = `Basic eo0w666ik66689a`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(authorization, endPoint) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(Comments.parseComments);
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Film.parseFilms);
  }

  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Film.parseFilm);
  }

  deleteComment(id) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  createComment(comment, id) {

    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then((data) => {
        return data.comments[data.comments.length - 1];
      })
      .then(Comments.parseComment);
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};
const api = new API(AUTHORIZATION, END_POINT);

export default api;
