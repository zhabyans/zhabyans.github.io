// app.js
import { normalizeInput, setupTogglePassword, preventTextSelectionAndContextMenu } from "./utils.js";
import { setupTheme } from "./tema.js";
import { setupAuth } from "./auth.js";

let domain = "pulsa.dpdns.org";

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then((reg) => console.log("Service Worker registered:", reg.scope))
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

// Terapkan fungsi normalisasi
normalizeInput(inputTujuan);


// Cegah text selection & context menu
preventTextSelectionAndContextMenu();