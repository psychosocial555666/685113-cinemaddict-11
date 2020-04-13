import {titles, genres, urls, descriptions, authors, smiles, commentTexts, ages, directors, actors, writers, releases, countries} from "./data";
import {getRandomDate, getRandomArrayItem, getRandomNumber, getRandomFractionalNumber, makeRandomArr} from "../utils";

const generateComment = () => {
  return {
    smile: getRandomArrayItem(smiles),
    author: getRandomArrayItem(authors),
    text: getRandomArrayItem(commentTexts),
    date: getRandomDate(),
  };
};

const generateComments = () => {
  return (
    new Array(getRandomNumber(0, 5))
    .fill(``)
    .map(generateComment)
  );
};

const generateFilm = () => {
  return (
    {
      title: getRandomArrayItem(titles),
      rating: `${getRandomFractionalNumber(3, 9)}`,
      year: ` ${getRandomNumber(1920, 2020)}`,
      duration: getRandomNumber(60, 180),
      genre: makeRandomArr(genres).slice(0, getRandomNumber(1, 3)),
      url: getRandomArrayItem(urls),
      description: makeRandomArr(descriptions).slice(0, getRandomNumber(1, 5)),
      comments: generateComments(),
      age: getRandomArrayItem(ages),
      actors: getRandomArrayItem(actors),
      writers: getRandomArrayItem(writers),
      director: getRandomArrayItem(directors),
      release: getRandomArrayItem(releases),
      country: getRandomArrayItem(countries),
      isInWatchlist: Math.random() > 0.5,
      isInHistory: Math.random() > 0.5,
      isInFavorites: Math.random() > 0.5,
    }
  );
};

const generateFilms = (count) => {
  return (
    new Array(count)
    .fill(``)
    .map(generateFilm)
  );
};
export {generateFilms, getRandomArrayItem};
