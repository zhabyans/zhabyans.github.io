import { showToast } from "./utils.js";

let backPressedOnce = false;
let backPressTimer = null;

function showExitToast() {
  showToast("Tekan sekali lagi untuk keluar", "sukses");
}

export function setupBackHandler() {
  window.addEventListener("popstate", (e) => {
    e.preventDefault();

    // cek dulu kalau ada modal terbuka
    if (window.modalTerbuka) {
      const modalOverlay = document.getElementById("modalOverlay");
      if (modalOverlay) {
        modalOverlay.style.display = "none";
        window.modalTerbuka = false;
      }
      return; // cukup close modal
    }

    // kalau tidak ada modal → lanjut logika exit
    if (!backPressedOnce) {
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
