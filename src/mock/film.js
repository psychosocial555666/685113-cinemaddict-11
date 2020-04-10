import {titles, genres, urls, descriptions, authors, smiles, commentTexts, ages, directors, actors, writers, releases, countries} from "./data";

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length);

  return array[randomIndex];
};

const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomFractionalNumber = (min, max) => {
  let number = min + (Math.random() * (max - min));
  return number.toFixed(1);
};

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
    new Array(getRandomNumber(0, 51))
    .fill(``)
    .map(generateComment)
  );
};

const generateFilm = () => {
  return (
    {
      title: getRandomArrayItem(titles),
      rating: `${getRandomFractionalNumber(0, 9)}`,
      year: ` ${getRandomNumber(1920, 2020)}`,
      duration: ` ${getRandomNumber(1, 2)}h  ${getRandomNumber(1, 59)}m`,
      genre: getRandomArrayItem(genres),
      url: getRandomArrayItem(urls),
      description: getRandomArrayItem(descriptions),
      comments: generateComments(),
      age: getRandomArrayItem(ages),
      actors: getRandomArrayItem(actors),
      writers: getRandomArrayItem(writers),
      director: getRandomArrayItem(directors),
      release: getRandomArrayItem(releases),
      country: getRandomArrayItem(countries),
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
export {generateFilms, generateFilm, getRandomArrayItem};
