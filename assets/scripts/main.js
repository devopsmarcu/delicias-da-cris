import { ready } from "./utils/dom.js";

ready(() => {
  const whatsapp = document.querySelector(".cta[href^='https://wa.me']");
  if (whatsapp) {
    whatsapp.setAttribute("data-tracking", "whatsapp-cta");
  }
});

