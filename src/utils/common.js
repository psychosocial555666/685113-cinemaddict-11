
// import moment from "moment";

const transformTimeFormat = (filmTime) => {
  const filmHours = Math.floor(filmTime / 60);
  const filmMinutes = filmTime - (filmHours * 60);

  return `${filmHours}h  ${filmMinutes}m`;
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max + 1 - min));
};

const getRandomFractionalNumber = (min, max) => {
  let number = min + (Math.random() * (max - min));
  return number.toFixed(1);
};

const makeRandomArr = (array) => {
  const shuffle = () => {
    return Math.random() - 0.5;
  };
  return array.sort(shuffle);
};

const getArrayFromText = (text) => {
  return text. split(`. `);
};

const getFavoriteGenre = (arr) => {
  let genres = arr
      .filter((movie) => movie.isInFavorites)
      .map(({genre}) => genre)
      .flat()
      .reduce((obj, genre) => {
        obj[genre] = obj[genre] ? ++obj[genre] : 1;
        return obj;
      }, {});
  const arrGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]);
  const maxGenre = arrGenres[0][1];
  return arrGenres.filter((genre) => genre[1] === maxGenre).map((genre) => genre[0]).join(`, `);
};

const getUserRating = (arr) => {
  const watchedMoviesQuantity = arr.length;
  let userRating = ``;
  if (watchedMoviesQuantity > 0 && watchedMoviesQuantity <= 10) {
    userRating = `Novice`;
  } else if (watchedMoviesQuantity > 10 && watchedMoviesQuantity <= 20) {
    userRating = `Fan`;
  } else if (watchedMoviesQuantity > 21) {
    userRating = `Movie Buff`;
  }
  return userRating;
};

export {transformTimeFormat, getFavoriteGenre, getUserRating, getRandomDate, getRandomArrayItem,
  getRandomNumber, getRandomFractionalNumber, makeRandomArr, getArrayFromText};
