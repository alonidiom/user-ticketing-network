import { WebComponent } from "/js/vendors/bean.js";

export default class extends WebComponent {
  static tagName = "ui-theme";
  static html = `
        <style>
            :host {
                --ui-colors-primary: #4CAF50;
                --ui-colors-primary-text: #FFFFFF;
                --ui-colors-secondary: #2196F3;
                --ui-colors-secondary-text: #FFFFFF;
                --ui-colors-tertiary: #FF9800;
                --ui-colors-tertiary-text: #FFFFFF;
                --ui-colors-quaternary: #009688;
                --ui-colors-quaternary-text: #FFFFFF;
                --ui-colors-quinary: #FFEB3B;
                --ui-colors-quinary-text: #000;
                --ui-colors-senary: #673AB7;
                --ui-colors-senary-text: #FFFFFF;
                --ui-colors-septenary: #3F51B5;
                --ui-colors-septenary-text: #FFFFFF;
                --ui-colors-error: #ff0000;
            }
        </style>
        <slot></slot>
    `;

  static {
    this.setup();
  }
}
