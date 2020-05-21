import {FilterType} from "../controllers/filter.js";

const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isInWatchlist);
};

const getHistoryFilms = (films) => {
  return films.filter((film) => film.isInHistory);
};

const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isInFavorites);
};

const getfilmsByFilter = (films, filterType) => {

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

export {getWatchlistFilms, getHistoryFilms, getFavoriteFilms, getfilmsByFilter};
