//file: app.js
import { normalizeInput, setupTogglePassword, preventTextSelectionAndContextMenu, showToast } from "./utils.js";
import { setupTheme } from "./tema.js";
import { setupAuth } from "./auth.js";
// import { getKontak } from "./getKontak.js";

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

// Terapkan fungsi normalisasi
normalizeInput(inputTujuan);


// Cegah text selection & context menu
preventTextSelectionAndContextMenu();

// getKontak();

const kekirimBtn = document.getElementById("kekirimBtn");

if (kekirimBtn) {
  kekirimBtn.addEventListener("click", () => {

    inputTujuan.value = "0856";
    inputTujuan.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    showToast(inputTujuan.value, "success", 5000);

    // biar semua listener lain jalan (normalizeInput, detectOperator, dsb.)
  });
}

const contactBtn = document.getElementById("contactBtn");
contactBtn.addEventListener("click", async () => {
  // nanti gunakan Contacts API jika tersedia
  if ("contacts" in navigator && "ContactsManager" in window) {
    try {
      const props = ["name", "tel"];
      const opts = { multiple: false };
      const contacts = await navigator.contacts.select(props, opts);
      if (contacts.length > 0) {
        inputTujuan.value = contacts[0].tel[0];
        showToast(inputTujuan.value, "success", 5000);
        inputTujuan.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      }
    } catch (err) {
      console.error("Akses kontak gagal:", err);
    }
  } else {
    alert("Browser Anda tidak mendukung akses kontak.");
  }
});