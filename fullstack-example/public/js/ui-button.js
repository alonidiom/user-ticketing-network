import { WebComponent, child, prop } from "/js/vendors/bean.js";

export default class extends WebComponent {
  static tagName = "ui-button";
  static defaultAttributes = {
    variant: "primary",
  };
  static html = `
        <style>
            button {
                background-color: var(--fill);
                color: var(--text);
                border: none;
                padding: 15px 32px;
            }
        </style>
        <button><slot></slot></button>
    `;

  button = child("button");

  get buttonStyle() {
    return this.button.style;
  }

  [prop("variant")](_, [variant]) {
    if (this.button) {
      this.buttonStyle.setProperty("--fill", `var(--ui-colors-${variant})`);
      this.buttonStyle.setProperty(
        "--text",
        `var(--ui-colors-${variant}-text)`
      );
    }
  }

  static {
    this.setup();
  }
}
