import { ready } from "./utils/dom.js";
import { Cart } from "./cart.js";
import { UI } from "./ui.js";

ready(() => {
  const cart = new Cart();
  const ui = new UI(cart);
  
  // Tracking original if necessary
  const whatsapp = document.querySelector(".cta[href^='https://wa.me']");
  if (whatsapp) {
    whatsapp.setAttribute("data-tracking", "whatsapp-cta");
  }
});

