import { ready } from "./utils/dom.js";
import { Cart } from "./cart.js";
import { UI } from "./ui.js";

ready(() => {
  const cart = new Cart();
  const ui = new UI(cart);
});
