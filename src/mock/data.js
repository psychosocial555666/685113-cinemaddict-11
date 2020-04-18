
import {getArrayFromText} from "./../utils/common.js";

const titles = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The Great Flamarion`,
  `Made for Each Other`,
];

const genres = [
  `Musical`,
  `Mystery`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Triller`,
  `Sci-fi`,
  `Horror`,
  `Documentary`,
  `Adventure`,
];

const urls = [
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/made-for-each-other.png`,
];

const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const descriptions = getArrayFromText(descriptionText);


const authors = [
  `Jim Root`,
  `David Drayman`,
  `James Hatfield`,
  `Serj Tankian`,
  `Phill Colins`,
  `Matt Tack`,
  `Matt Shadows`,
];

const smiles = [
  `smile`,
  `angry`,
  `puke`,
  `sleeping`,
];

const commentTexts = [
  `Id ut et ex amet cupidatat commodo ea aliquip commodo labore.`,
  `Ipsum sunt aliqua culpa ea elit deserunt nulla consectetur aliquip.Cupidatat occaecat esse qui officia fugiat qui amet.`,
  `Consequat deserunt officia sint ad occaecat.Ipsum nostrud pariatur labore duis non.`,
  `Dolore consequat non irure occaecat aute minim sint sunt.Minim do magna ea eiusmod dolor sint ad exercitation qui voluptate.`,
  `Eiusmod anim veniam enim ullamco laborum elit ullamco.`,
  `Voluptate exercitation ut nostrud laborum ipsum ad deserunt irure ea.Nulla commodo ad est amet excepteur exercitation velit nisi sint qui.`,
];

const ages = [
  `0+`,
  `3+`,
  `6+`,
  `9+`,
  `12+`,
  `16+`,
  `18+`,
];

const directors = [
  `Gai Richi`,
  `Vuddi Allen`,
  `Ridley Scott`,
  `Tim Berton`,
  `Clint Eastwood`,
  `Christofer Nolan`,
  `Quentin Tarantino`,
];

const actors = [
  `Vuddi Allen, Fransice Ford Coppola`,
  `Charly Kaufman, Joel Koen`,
  `Robert Town`,
  `Billy Wilder, James Kameron`,
  `Oliver Stone, Charly Kaufman`,
];

const writers = [
  `Bred Pit, Tom Cruse, Jonny Depp`,
  `Tom Cruse, Keanoo Reavse, Tom Hanks`,
  `Jonny Depp, Jackie Chan`,
  `Tom Hanks, Jonny Depp`,
  `Keanoo Reavse, Jonny Depp`,
  `Jackie Chan, Bred Pit, Tom Hanks`,
  `Quentin Tarantino, Jackie Chan, Keanoo Reavse`,
];

const releases = [
  `8 Sept`,
  `31 Aug`,
  `1 Feb`,
  `19 June`,
  `30 Dec`,
  `7 June`,
  `25 May`,
];

const countries = [
  `USA`,
  `UK`,
  `France`,
  `Russia`,
  `Germany`,
  `Italy`,
  `Austria`,
];


export {titles, genres, urls, descriptions, authors, smiles, commentTexts, ages, directors, actors, writers, releases, countries};

