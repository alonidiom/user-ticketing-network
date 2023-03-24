import { WebComponent } from "/js/vendors/bean.js";
import "./app-bar.js";

export default class extends WebComponent {
  static tagName = "app-not-found";
  static html = `
    <app-bar></app-bar>
    <h1>Page not found..</h1>
  `;

  static {
    this.setup();
  }
}
