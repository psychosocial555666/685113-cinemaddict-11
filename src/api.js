const API = class {
  getFilms() {
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict`);
  }
};

export default API;
