import { WebComponent, child } from "/js/vendors/bean.js";
import { state } from "./state.js";

export default class extends WebComponent {
  static tagName = "app-bar";
  static html = `
    <style>
      nav, header {
        display: flex;
        justify-content: space-between;
      }

      ul {
        display: flex;
        gap: 10px;
        list-style-type: none;
      }
    </style>
    <header>
    <h2>FuulStack Proxy</h2>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
    <p class="user" hidden></p>
    </header>
  `;

  user = child(".user");

  onAfterMount() {
    this.reactTo(state, ({ user }) => {
      if (user) {
        this.user.textContent = user.fullName;
        this.user.hidden = false;
      } else {
        this.user.textContent = "";
        this.user.hidden = true;
      }
    });
  }

  static {
    this.setup();
  }
}
