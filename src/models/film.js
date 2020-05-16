import moment from "moment";

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
    this.releaseFull = moment(data.film_info.release[`date`]);
    this.country = data.film_info.release[`release_country`];
    this.watchingDate = moment(data.user_details[`watching_date`]);
    this.isInWatchlist = Boolean(data.user_details[`watchlist`]);
    this.isInHistory = Boolean(data.user_details[`already_watched`]);
    this.isInFavorites = Boolean(data.user_details[`favorite`]);
    this.emotion = ``;
    this.comments = data[`comments`];
    this.commentsAll = [];
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.alternativeTitle,
        "total_rating": this.rating,
        "poster": this.url,
        "age_rating": this.age,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseFull,
          "release_country": this.country
        },
        "runtime": this.duration,
        "genre": this.genre,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.isInWatchlist,
        "already_watched": this.isInHistory,
        "watching_date": this.watchingDate,
        "favorite": this.isInFavorites
      }
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
