import {getUserRating, getFavoriteGenre} from "../utils";

const generateStatistics = (array) => {
  const watchedMovies = array.filter((it)=> it.isInHistory);
  const durations = watchedMovies.map((it) => it.duration);
  // const allFavoriteGenres = array.filter((movie) => movie.isInFavorites)
  //                                .map((it) => it.genre).flat();

  return {
    rating: getUserRating(watchedMovies),
    totalMovies: watchedMovies.length,
    totalDuration: watchedMovies.length > 0 ? durations.reduce((a, b) => a + b) : ``,
    topGenre: watchedMovies.length > 0 ? getFavoriteGenre(array) : ``,
    avatar: `images/bitmap@2x.png`,
  };
};

export {generateStatistics};

