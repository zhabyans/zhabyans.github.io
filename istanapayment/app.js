//file: app.js
import { normalizeInput, setupTogglePassword, preventTextSelectionAndContextMenu, showToast } from "./utils.js";
import { setupTheme } from "./tema.js";
import { setupAuth } from "./auth.js";
import { getKontak } from "./getKontak.js";

let domain = "pulsa.dpdns.org";

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


setupAuth(domain);

setupTheme();

// ----------------------
// MENCEGAH KLIK KANAN
// ----------------------
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// ----------------------
// TOMBOL REFRESH
// ----------------------
document.getElementById("refreshBtn")?.addEventListener("click", () => {
  window.location.reload(); // reload seluruh halaman
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