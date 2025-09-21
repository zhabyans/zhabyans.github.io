//file: serviceWorkerRegister.js
import { showToast } from "./utils.js";

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js")
        .then((reg) => {
          console.log("Service Worker registered:", reg.scope);

          reg.onupdatefound = () => {
            const newWorker = reg.installing;
            newWorker.onstatechange = () => {
              if (newWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  showToast("Versi baru tersedia\nsilakan keluar lalu masuk lagi!", "success");
                  setTimeout(() => window.location.reload(), 1500);
                }
              }
            };
          };
        })
        .catch((err) => console.log("Service Worker failed:", err));
    });
  }
}
