import {getUserRating, getFavoriteGenre} from "../utils";

const generateStatistics = (array) => {
  const watchedMovies = array.filter((it)=> it.isInHistory);
  const durations = watchedMovies.map((it) => it.duration);
  const allWatchedGenres = watchedMovies.map((it) => it.genre).flat();

  return {
    rating: getUserRating(watchedMovies),
    totalMovies: watchedMovies.length,
    totalDuration: durations.reduce((a, b) => a + b),
    topGenre: getFavoriteGenre(allWatchedGenres),
    avatar: `images/bitmap@2x.png`,
  };
};

export {generateStatistics};

