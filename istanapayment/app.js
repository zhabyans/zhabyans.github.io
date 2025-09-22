//file: app.js
import { normalizeInput, setupTogglePassword, preventTextSelectionAndContextMenu, showToast } from "./utils.js";
import { setupTheme } from "./tema.js";
import { setupAuth } from "./auth.js";
import { getKontak } from "./getKontak.js";
import { navigasi } from "./navigasi.js";
import { akunPage } from "./akunPage.js";
import { navigasiKeyboard, navigasiToast } from "./navigasiKeyboard.js";
import { setupRegister } from "./register.js";
import { setupBackHandler } from "./backHandler.js";
import { registerServiceWorker } from "./serviceWorkerRegister.js";

navigasi();
akunPage();
let domain = "pulsa.dpdns.org";

// panggil modul registrasi service worker
registerServiceWorker();

// ----------------------
// MENCEGAH KLIK KANAN
// ----------------------
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});


// tambahkan event listener ke semua tombol refresh
document.querySelectorAll(".refreshBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    console.log("Refresh button clicked, reloading...");
    window.location.reload(); // reload seluruh halaman
  });
});


// Setup hide/show password
const togglePass = document.getElementById("togglePass");
const passInput = document.getElementById("paswote");
setupTogglePassword(togglePass, passInput);

// Ambil input tujuan
const inputTujuan = document.getElementById("inputTujuan");

// Pasang listener untuk normalize setiap kali input berubah
inputTujuan.addEventListener("input", () => {
  inputTujuan.value = normalizeInput(inputTujuan.value);
});

// Cegah text selection & context menu
preventTextSelectionAndContextMenu();

getKontak();
setupAuth(domain);
setupRegister(domain);
setupTheme();
navigasiKeyboard();
navigasiToast();

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

setupBackHandler();

// file: app.js
document.addEventListener("focusin", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    setTimeout(() => {
      e.target.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 300);
  }
});
