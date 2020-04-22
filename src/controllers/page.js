
import FilmComponent from "../components/film-card";
import PopupComponent from "../components/popup";
import ShowMoreComponent from "../components/show-more";
import SortComponent, {SortType} from "../components/sort";


import {render, remove, RenderPosition} from "../utils/render.js";

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

const getSortedFilms = (films, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedTasks = showingTasks.sort((a, b) => b.year - a.year);
      break;
    case SortType.RATING:
      sortedTasks = showingTasks.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};


export default class PageController {
  constructor(container) {
    this._container = container;
    this._showMoreComponent = new ShowMoreComponent();
    this._sortComponent = new SortComponent();
  }

  render(films) {

    render(this._container.getElement(), this._sortComponent.getElement(), RenderPosition.AFTERBEGIN);

    const filmsList = this._container.getElement().querySelector(`.films-list`);
    const filmsListExtra = this._container.getElement().querySelectorAll(`.films-list--extra`);
    const filmsListContaner = filmsList.querySelector(`.films-list__container`);
    const filmsListRatedContaner = filmsListExtra[0].querySelector(`.films-list__container`);
    const filmsListCommentedContaner = filmsListExtra[1].querySelector(`.films-list__container`);

    let currentFilmsCount = SHOWING_CARDS_ON_START;

    const mostRatedFilms = films.slice(0, films.length).sort((a, b) => (b.rating - a.rating)).slice(0, CARDS_EXTRA_COUNT);
    const mostCommentedFilms = films.slice(0, films.length).sort((a, b) => (b.comments.length - a.comments.length)).slice(0, CARDS_EXTRA_COUNT);

    const renderShowMoreButton = () => {
      if (currentFilmsCount >= films.length) {
        return;
      }
      render(filmsList, this._showMoreComponent.getElement());
      this._showMoreComponent.setClickHandler(() => {
        const prevFilmsCount = currentFilmsCount;
        currentFilmsCount = currentFilmsCount + SHOWING_CARDS_ON_BUTTON_CLICK;

        films.slice(prevFilmsCount, currentFilmsCount).forEach((film) => (renderFilm(filmsListContaner, film)));

        if (currentFilmsCount >= films.length) {
          remove(this._showMoreComponent);
        }
      });
    };

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      currentFilmsCount = SHOWING_CARDS_ON_BUTTON_CLICK;

      const sortedFilms = getSortedFilms(films, sortType, 0, currentFilmsCount);

      filmsListContaner.innerHTML = ``;

      sortedFilms.slice(0, currentFilmsCount).forEach((film) => {
        (renderFilm(filmsListContaner, film));
      });
      renderShowMoreButton();
    });

    films.slice(0, currentFilmsCount).forEach((film) => {
      (renderFilm(filmsListContaner, film));
    });

    mostRatedFilms.forEach((film) => {
      (renderFilm(filmsListRatedContaner, film));
    });

    mostCommentedFilms.forEach((film) => {
      (renderFilm(filmsListCommentedContaner, film));
    });

    renderShowMoreButton();
  }
}
