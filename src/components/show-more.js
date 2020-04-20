import AbstractComponent from "./abstract-component.js";

const createShowMoreTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMore extends AbstractComponent {
  getTemplate() {
    return createShowMoreTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
