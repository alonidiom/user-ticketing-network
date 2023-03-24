import { WebComponent, child } from "/js/vendors/bean.js";
import { refereseUser, state, getToken } from "./state.js";
import "./app-bar.js";
import "./ui-button.js";

export default class extends WebComponent {
  static tagName = "app-home";
  static html = `
     <style>
      section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
     </style>
     <app-bar></app-bar>
     <h1>Hello, world!</h1>
     <section>
      <ui-button variant="primary">Log Out</ui-button>
     </section>
  `;

  button = child("ui-button[variant='primary']");

  constructor(...args) {
    super(...args);
    if (!state.current.user) {
      window.location.pathname = "/login";
    }
  }

  onAfterMount() {
    this.reactTo(state, ({ user }) => {
      if (!user) {
        window.location.pathname = "/login";
      }
    });
    this.button.addEventListener("click", async () => {
      await fetch("/api/logout", { headers: { "x-token": getToken() } });
      await refereseUser();
    });
  }

  static {
    this.setup();
  }
}
