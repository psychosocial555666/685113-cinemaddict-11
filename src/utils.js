const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

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

// const getFavoriteGenre = (arr) => {
//   let genreItem = arr[0];
//   let maxRepeatNumber = 1;
//   for (let i = 0; i < arr.length; i++) {
//     let repeatNumber = 0;
//     for (let j = 0; j - arr.length - 1; j++) {
//       if (arr[i] === arr[j]) {
//         repeatNumber += 1;
//       }
//     }
//     if (repeatNumber > maxRepeatNumber) {
//       maxRepeatNumber = repeatNumber;
//       genreItem = arr[i];
//     }
//   }
//   return genreItem;
// };

const getUserRating = (arr) => {
  const watchedMoviesQuantity = arr.length;
  let userRating = ``;
  if (watchedMoviesQuantity > 0 && watchedMoviesQuantity <= 10) {
    userRating = `Novice`;
  } else if (watchedMoviesQuantity > 10 && watchedMoviesQuantity <= 20) {
    userRating = `Fan`;
  } else {
    userRating = `Movie Buff`;
  }
  return userRating;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {transformTimeFormat, getFavoriteGenre, getUserRating, getRandomDate, getRandomArrayItem,
  getRandomNumber, getRandomFractionalNumber, makeRandomArr, getArrayFromText, createElement, render,
  RenderPosition};
