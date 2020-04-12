const generateFilters = (array) => {

  return (
    [
      {
        name: `Watchlist`,
        count: array.filter((it)=> it.isInWatchlist).length,
      },
      {
        name: `History`,
        count: array.filter((it)=> it.isInHistory).length,
      },
      {
        name: `Favorites`,
        count: array.filter((it)=> it.isInFavorites).length,
      },
    ]
  );
};
export {generateFilters};
