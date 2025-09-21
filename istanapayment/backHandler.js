import { showToast } from "./utils.js";

let backPressedOnce = false;
let backPressTimer = null;

function showExitToast() {
  showToast("Tekan sekali lagi untuk keluar", "sukses");
}

export function setupBackHandler() {
  window.addEventListener("popstate", (e) => {
    if (!backPressedOnce) {
      e.preventDefault();
      showExitToast();
      backPressedOnce = true;

      if (backPressTimer) clearTimeout(backPressTimer);
      backPressTimer = setTimeout(() => {
        backPressedOnce = false;
      }, 1500);

      history.pushState({ dummy: true }, null, location.href);
    } else {
      if (backPressTimer) clearTimeout(backPressTimer);
      backPressedOnce = false;
      // biarkan default → aplikasi close
    }
  });

  // tambahkan 1 state dummy saat load
  window.addEventListener("load", () => {
    history.pushState({ first: true }, null, location.href);
  });
}
