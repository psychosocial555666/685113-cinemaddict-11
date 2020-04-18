import AbstractComponent from "./abstract-component.js";

export const createStatisticsTemplate = (allMovies) => {
  return (
    `<p>${allMovies} movies inside</p>`
  );
};
export default class Statistics extends AbstractComponent {
  constructor(allMovies) {
    super();
    this._allMovies = allMovies;
  }

  getTemplate() {
    return createStatisticsTemplate(this._allMovies);
  }
}
