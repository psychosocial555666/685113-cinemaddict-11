import moment from "moment";

export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`title`];
    this.alternativeTitle = data[`alternative_title`];
    this.rating = data[`total_rating`];
    this.year = moment(data[`date`]).format(`YYYY`);
    this.duration = data[`runtime`];
    this.genre = data[`genre`];
    this.url = data[`poster`];
    this.description = data[`description`];
    this.age = data[`age_rating`];
    this.actors = data[`actors`];
    this.writers = data[`writers`];
    this.director = data[`director`];
    this.release = moment(data[`date`]).format(`DD[ ]MMMM`);
    this.country = data[`release_country`];
    this.watchingDate = data[`watching_date`];

    this.isInWatchlist = Boolean(data[`watchlist`]);
    this.isInHistory = Boolean(data[`already_watched`]);
    this.isInFavorites = Boolean(data[`favorite`]);
    this.comments = data[`comments`];
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }
}
