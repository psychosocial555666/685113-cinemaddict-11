import Film from "../models/film";
import Comments from "../models/comments";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedFilms = (items) => {

  return items.filter(({success}) => success)
      .map(({payload}) => payload.film);

};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
      .then((films) => {
        const items = createStoreStructure(films.map((film) => film.toRAW()));

        this._store.setItems(items);

        return films;
      });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(Film.parseFilms(storeFilms));
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id)
      .then((comments) => {
        const items = createStoreStructure(comments.map((comment) => comment.toRAW()));

        this._store.setItems(items);

        return comments;
      });
    }

    const storeComments = Object.values(this._store.getItems());

    return Promise.resolve(Comments.parseComments(storeComments));
  }

  updateFilm(id, data) {

    if (isOnline()) {
      return this._api.updateFilm(id, data)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm.toRAW());

          return newFilm;
        });
    }

    const localFilm = Film.clone(Object.assign(data, {id}));

    this._store.setItem(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  createComment(comment, filmId) {

    if (isOnline()) {
      return this._api.createComment(comment, filmId)
      .then((newComment) => {
        this._store.setItem(newComment.id, newComment.toRAW());

        return newComment;
      });
    }

    const localNewCommentId = nanoid();
    const commentToClone = Object.assign(comment, {id: localNewCommentId}, {author: `You`});
    const localNewComment = Comments.clone(commentToClone);

    this._store.setItem(localNewComment.id, localNewComment.toRAW());

    return Promise.resolve(localNewComment);
  }

  deleteComment(id) {

    if (isOnline()) {
      return this._api.deleteComment(id)
        .then((data) => {
          this._store.removeItem(id);
          return data;
        });
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const updatedFilms = getSyncedFilms(response.updated);
          const createdComments = getSyncedFilms(response.created);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdComments, ...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
