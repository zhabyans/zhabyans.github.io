//file: app.js
import { normalizeInput, setupTogglePassword, preventTextSelectionAndContextMenu, showToast } from "./utils.js";
import { setupTheme } from "./tema.js";
import { setupAuth } from "./auth.js";
import { getKontak } from "./getKontak.js";
import { navigasi } from "./navigasi.js";
import { akunPage } from "./akunPage.js";
import { navigasiKeyboard, navigasiToast } from "./navigasiKeyboard.js";
import { setupRegister } from "./register.js";

navigasi();
akunPage();
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

let backPressedOnce = false;
let backPressTimer = null;

function showExitToast() {
  // bikin toast sederhana (atau pakai toast kamu sendiri)
  const toast = document.createElement("div");
  toast.textContent = "Tekan sekali lagi untuk keluar";
  toast.style.position = "fixed";
  toast.style.bottom = "60px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 1500);
}

// pasang event listener
window.addEventListener("popstate", (e) => {
  if (!backPressedOnce) {
    e.preventDefault();
    showExitToast();
    backPressedOnce = true;

    backPressTimer = setTimeout(() => {
      backPressedOnce = false;
      // bersihkan dummy state supaya tidak langsung keluar
      if (history.state === null) {
        history.back();
      }
    }, 1500);

    // dorong lagi state biar ga langsung keluar
    history.pushState({dummy:true}, null, location.href);
  } else {
    // tekan 2x dalam 1.5 detik → benar-benar keluar
    if (backPressTimer) clearTimeout(backPressTimer);
    backPressedOnce = false;
    // biarkan default → aplikasi close
  }
});

// saat load tambahkan dummy sekali
window.addEventListener("load", () => {
  history.pushState({first:true}, null, location.href);
});


