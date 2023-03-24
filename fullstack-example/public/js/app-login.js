import { WebComponent, child } from "/js/vendors/bean.js";
import { setToken, state } from "./state.js";
import "./app-bar.js";
import "./ui-button.js";

export default class extends WebComponent {
  static tagName = "app-login";
  static html = `
     <style>
      .error { 
        color: var(--ui-colors-error);
      }
     </style>
     <app-bar></app-bar>
     <h1>Log In</h1>
     <div>
      <form>
        <div>
          <label>
            Email:
            <input name="email" type="email" required />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input name="password" type="password" required />
          </label>
        </div>
        <p class="error" hidden></p>
        <button type="submit">Log In</button>
      </form>
    </div>
    <a href="/signup">Sign Up</a>
  `;

  form = child("form");
  error = child(".error");

  onAfterMount() {
    this.reactTo(state, ({ user }) => {
      if (user) {
        console.log(user);
        window.location.pathname = "/";
      }
    });
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      this.login(Object.fromEntries(formData.entries()));
    });
  }

  async login(data) {
    const response = await fetch("/api/create-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      this.error.textContent = response.statusText;
      this.error.hidden = false;
      return;
    }
    this.error.remove();
    const { token } = await response.json();
    setToken(token);
  }

  static {
    this.setup();
  }
}
