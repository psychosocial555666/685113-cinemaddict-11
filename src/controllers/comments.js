import CommentsComponent from "../components/comments.js";
// import {render, replace, remove} from "../utils/render.js";

export default class FilmController {
  constructor(filmsModel) {
    this._filmsModel = filmsModel;
    this._commentsComponent = null;
  }
  render(film) {

    this._commentsComponent = new CommentsComponent(film).getTemplate();

    return this._commentsComponent;
  }
}
