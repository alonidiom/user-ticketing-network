import { createRouter } from "/js/vendors/bean.js";
import "./ui-theme.js";

const theme = document.createElement("ui-theme");
theme.appendChild(
  createRouter(({ pathname }) => {
    switch (pathname) {
      case "/": {
        return import("/js/app-home.js");
      }
      case "/login": {
        return import("/js/app-login.js");
      }
      default: {
        return import("/js/app-404.js");
      }
    }
  })
);

document.body.appendChild(theme);
