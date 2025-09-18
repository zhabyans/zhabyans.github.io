//file: app.js
import { normalizeInput, setupTogglePassword, preventTextSelectionAndContextMenu, showToast } from "./utils.js";
import { setupTheme } from "./tema.js";
import { setupAuth } from "./auth.js";
import { getKontak } from "./getKontak.js";
import { navigasi } from "./navigasi.js";
import { akunPage } from "./akunPage.js";
import { navigasiKeyboard } from "./navigasiKeyboard.js";
import { setupRegister } from "./register.js";

navigasi();
akunPage();
let domain = "5.78.73.218";
console.log("test ini : " + Strophe.Connection.prototype.register); // undefined biasanya, plugin nambah
// Register Service Worker
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
                showToast("Versi baru tersedia, silakan refresh halaman!", "success");
                setTimeout(() => window.location.reload(), 1500);
              }
            }
          };
        };
      })
      .catch((err) => console.log("Service Worker failed:", err));
  });
}

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

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

