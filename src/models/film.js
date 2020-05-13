import moment from "moment";
import Comments from "./comments.js";

const AUTHORIZATION = `Basic eo0w666ik66689a`;

export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.title = data.film_info[`title`];
    this.alternativeTitle = data.film_info[`alternative_title`];
    this.rating = data.film_info[`total_rating`];
    this.year = moment(data.film_info.release[`date`]).format(`YYYY`);
    this.duration = data.film_info[`runtime`];
    this.genre = data.film_info[`genre`];
    this.url = data.film_info[`poster`];
    this.description = data.film_info[`description`];
    this.age = data.film_info[`age_rating`];
    this.actors = data.film_info[`actors`];
    this.writers = data.film_info[`writers`];
    this.director = data.film_info[`director`];
    this.release = moment(data.film_info[`date`]).format(`DD[ ]MMMM`);
    this.country = data.film_info.release[`release_country`];
    this.watchingDate = data.user_details[`watching_date`];

    this.isInWatchlist = Boolean(data.user_details[`watchlist`]);
    this.isInHistory = Boolean(data.user_details[`already_watched`]);
    this.isInFavorites = Boolean(data.user_details[`favorite`]);
    this.commentsID = data[`comments`];
    this.emotion = ``;
    this.comments = this.getComments(data[`id`]);
  }

  getComments(id) {
    const headers = new Headers();
    headers.append(`Authorization`, AUTHORIZATION);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${id}`, {headers})
      .then((response) => response.json())
      .then(Comments.parseComments);
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }
}
