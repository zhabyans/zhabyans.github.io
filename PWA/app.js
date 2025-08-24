// app.js
import { connectXMPP, connection, log, clearCredentials } from "./xmpp.js";

let domain = "pulsa.dpdns.org";

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then((reg) => console.log("Service Worker registered:", reg.scope))
      .catch((err) => console.log("Service Worker failed:", err));
  });
}

// Ambil kredensial dari localStorage
function getCredentials() {
  return {
    jid: localStorage.getItem("xmpp_jid"),
    pass: localStorage.getItem("xmpp_pass"),
  };
}

// Event login manual
document.getElementById("masukDisplay").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("akune").value;
  const pass = document.getElementById("paswote").value;

  if (!user || !pass) {
    alert("Username dan password harus diisi");
    return;
  }

  const jid = user + "@" + domain;
  connectXMPP(jid, pass);
});

// Event logout
document.getElementById("logoutBtn").addEventListener("click", function () {
  if (connection) {
    connection.disconnect();
    log("Manual logout.");
    clearCredentials();
  }
});

// Auto login jika ada data tersimpan
window.addEventListener("load", () => {
  const creds = getCredentials();
  console.log("Loaded credentials from localStorage:", creds);

  const loadingDiv = document.getElementById("loading");
  const masukDisplay = document.getElementById("masukDisplay");
  const homeDisplay = document.getElementById("homeDisplay");
  const saldoDisplay = document.getElementById("saldoDisplay");


  if (creds.jid && creds.pass) {
    log("Found saved credentials, auto-logging in...");

    // Isi otomatis ke input
    document.getElementById("akune").value = creds.jid.split("@")[0];
    document.getElementById("paswote").value = creds.pass;

    // Tetap tampil loading sampai status CONNECTED
    connectXMPP(creds.jid, creds.pass, () => {
      // Setelah berhasil connect, sembunyikan loading
      loadingDiv.style.display = "none";
    });

  } else {
    // Tidak ada kredensial → sembunyikan loading, tampilkan form login
    loadingDiv.style.display = "none";
    saldoDisplay.style.display = "none";
    homeDisplay.style.display = "none";
    masukDisplay.style.display = "block";
  }
});


// ----------------------
// TEMA DARK / LIGHT
// ----------------------
const toggleBtn = document.getElementById("toggleTheme");
const htmlTag = document.documentElement;
const themeMeta = document.getElementById("theme-color");

// cek preferensi dari localStorage dulu
let savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  htmlTag.setAttribute("data-theme", savedTheme);
} else {
  // kalau belum ada, ikuti preferensi perangkat
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    htmlTag.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    htmlTag.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

// set status bar & tombol sesuai mode
updateUI();

toggleBtn.addEventListener("click", () => {
  let currentTheme = htmlTag.getAttribute("data-theme");

  if (currentTheme === "dark") {
    htmlTag.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    htmlTag.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
  updateUI();
});

function updateUI() {
  let theme = htmlTag.getAttribute("data-theme");

  // update tombol
  if (theme === "dark") {
    toggleBtn.textContent = "☀️";
    themeMeta.setAttribute("content", "#121212"); // status bar dark
  } else {
    toggleBtn.textContent = "🌙";
    themeMeta.setAttribute("content", "#ffffff"); // status bar light
  }
}

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

// ----------------------
// HIDE / SHOW PASSWORD
// ----------------------
const togglePass = document.getElementById("togglePass");
const passInput = document.getElementById("paswote");
togglePass.addEventListener("click", () => {
  if (passInput.type === "password") {
    passInput.type = "text";
    togglePass.textContent = "🙈"; // ganti ikon saat terlihat
  } else {
    passInput.type = "password";
    togglePass.textContent = "👁";
  }
});


// ----------------------
// NORMALIZE INPUT
// ----------------------
const inputTujuan = document.getElementById("inputTujuan");
inputTujuan.addEventListener("input", () => {
  let val = inputTujuan.value;

  // Hapus semua karakter kecuali angka
  val = val.replace(/\D/g, "");

  // Normalisasi ke format 08xxxx
  if (val.startsWith("62")) {
    val = "0" + val.substring(2);
  } else if (val.startsWith("0")) {
    // sudah benar, biarkan
  } else if (val.startsWith("8")) {
    // jika user ketik 812..., otomatis jadi 0812...
    val = "0" + val;
  }

  inputTujuan.value = val;
});


// ---------------------------------
// MENCEGAH TEXT SELECTION
// ---------------------------------
document.addEventListener('selectstart', function (e) {
  e.preventDefault(); // cegah seleksi teks
});

document.addEventListener('contextmenu', function (e) {
  e.preventDefault(); // cegah context menu
});
