import api from "./api/index.js";
import Provider from "./api/provider.js";
import FilmsComponent from "./components/films";
import LoadingComponent from "./components/loading";
import FilmsModel from "./models/films.js";
import NoFilmsComponent from "./components/no-films";
import PageController from "./controllers/page.js";
import Store from "./api/store.js";

import {render, remove} from "./utils/render.js";
const STORE_PREFIX = `cinemadict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const mainContainer = document.querySelector(`.main`);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();

const loadingComponent = new LoadingComponent();
const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent, filmsModel, apiWithProvider);
render(mainContainer, loadingComponent.getElement());

apiWithProvider.getFilms()
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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
      .then(() => {

      }).catch(() => {

      });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});


