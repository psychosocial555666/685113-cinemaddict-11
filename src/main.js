
import api from "./api.js";
import FilmsComponent from "./components/films";
import LoadingComponent from "./components/loading";
import FilmsModel from "./models/films.js";
import NoFilmsComponent from "./components/no-films";
import PageController from "./controllers/page.js";

import {render, remove} from "./utils/render.js";

const mainContainer = document.querySelector(`.main`);

const filmsModel = new FilmsModel();

const loadingComponent = new LoadingComponent();
const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent, filmsModel, api);
render(mainContainer, loadingComponent.getElement());

api.getFilms()
  .then((films) => {
    if (films.length === 0) {
      render(mainContainer, new NoFilmsComponent().getElement());
    } else {
      remove(loadingComponent);
      filmsModel.setFilms(films);
      render(mainContainer, filmsComponent.getElement());
      pageController.render();
    }
  });

