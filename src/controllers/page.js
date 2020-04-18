
import FilmComponent from "../components/film-card";
import PopupComponent from "../components/popup";
import ShowMoreComponent from "../components/show-more";


import {render, remove} from "../utils/render.js";

const CARDS_EXTRA_COUNT = 2;
const SHOWING_CARDS_ON_START = 5;
const SHOWING_CARDS_ON_BUTTON_CLICK = 5;

const bodyContainer = document.querySelector(`body`);

const renderFilm = (filmElement, film) => {
  const openPopup = () => {
    bodyContainer.appendChild(popupComponent.getElement());
  };
  const closePopup = () => {
    bodyContainer.removeChild(popupComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };


  const filmComponent = new FilmComponent(film);


  filmComponent.setPosterClickHandler(() => {
    openPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmComponent.setTitleClickHandler(() => {
    openPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmComponent.setCommentsClickHandler(() => {
    openPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });


  const popupComponent = new PopupComponent(film);

  popupComponent.setCloseButtonClick(() => {
    closePopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(filmElement, filmComponent.getElement());
};


// Отрисовка контейнера для карточек!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// const renderFilms = (filmsComponent, films) => {
//   const filmsList = filmsComponent.getElement().querySelector(`.films-list`);
//   const filmsListExtra = filmsComponent.getElement().querySelectorAll(`.films-list--extra`);
//   const filmsListContaner = filmsList.querySelector(`.films-list__container`);
//   const filmsListRatedContaner = filmsListExtra[0].querySelector(`.films-list__container`);
//   const filmsListCommentedContaner = filmsListExtra[1].querySelector(`.films-list__container`);

//   let currentFilmsCount = SHOWING_CARDS_ON_START;

//   const mostRatedFilms = films.slice(0, films.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
//   const mostCommentedFilms = films.slice(0, films.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);


//   films.slice(0, currentFilmsCount).forEach((film) => {
//     (renderFilm(filmsListContaner, film));
//   });

//   mostRatedFilms.forEach((film) => {
//     (renderFilm(filmsListRatedContaner, film));
//   });

//   mostCommentedFilms.forEach((film) => {
//     (renderFilm(filmsListCommentedContaner, film));
//   });

//   const showMoreComponent = new ShowMoreComponent();

//   render(filmsList, showMoreComponent.getElement());
//   showMoreComponent.setClickHandler(() => {
//     const prevFilmsCount = currentFilmsCount;
//     currentFilmsCount = currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;

//     films.slice(prevFilmsCount, currentFilmsCount).forEach((film) => (renderFilm(filmsListContaner, film)));

//     if (currentFilmsCount >= films.length) {
//       remove(showMoreComponent);
//     }
//   });
// };


export default class PageController {
  constructor(container) {
    this._container = container;
  }

  render(films) {

    const filmsList = this._container.getElement().querySelector(`.films-list`);
    const filmsListExtra = this._container.getElement().querySelectorAll(`.films-list--extra`);
    const filmsListContaner = filmsList.querySelector(`.films-list__container`);
    const filmsListRatedContaner = filmsListExtra[0].querySelector(`.films-list__container`);
    const filmsListCommentedContaner = filmsListExtra[1].querySelector(`.films-list__container`);

    let currentFilmsCount = SHOWING_CARDS_ON_START;

    const mostRatedFilms = films.slice(0, films.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
    const mostCommentedFilms = films.slice(0, films.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);


    films.slice(0, currentFilmsCount).forEach((film) => {
      (renderFilm(filmsListContaner, film));
    });

    mostRatedFilms.forEach((film) => {
      (renderFilm(filmsListRatedContaner, film));
    });

    mostCommentedFilms.forEach((film) => {
      (renderFilm(filmsListCommentedContaner, film));
    });

    const showMoreComponent = new ShowMoreComponent();

    render(filmsList, showMoreComponent.getElement());
    showMoreComponent.setClickHandler(() => {
      const prevFilmsCount = currentFilmsCount;
      currentFilmsCount = currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;

      films.slice(prevFilmsCount, currentFilmsCount).forEach((film) => (renderFilm(filmsListContaner, film)));

      if (currentFilmsCount >= films.length) {
        remove(showMoreComponent);
      }
    });
  }
}
