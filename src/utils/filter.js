import {FilterType} from "../controllers/filter.js";

export const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isInWatchlist);
};

export const getHistoryFilms = (films) => {
  return films.filter((film) => film.isInHistory);
};

export const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isInFavorites);
};

export const getfilmsByFilter = (films, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATHCLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getHistoryFilms(films);
    case FilterType.FAVORITES:
      return getFavoriteFilms(films);
  }

  return films;
};
