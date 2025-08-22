// app.js
import { connectXMPP, connection, log, saveCredentials, clearCredentials } from "./xmpp.js";

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
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

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
  const loginForm = document.getElementById("loginForm");

  if (creds.jid && creds.pass) {
    log("Found saved credentials, auto-logging in...");

    // Isi otomatis ke input
    document.getElementById("username").value = creds.jid.split("@")[0];
    document.getElementById("password").value = creds.pass;

    // Tetap tampil loading sampai status CONNECTED
    connectXMPP(creds.jid, creds.pass, () => {
      // Setelah berhasil connect, sembunyikan loading
      loadingDiv.style.display = "none";
    });

  } else {
    // Tidak ada kredensial → sembunyikan loading, tampilkan form login
    loadingDiv.style.display = "none";
    loginForm.style.display = "block";
  }
});

