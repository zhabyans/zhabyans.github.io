// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then((reg) => console.log("Service Worker registered:", reg.scope))
      .catch((err) => console.log("Service Worker failed:", err));
  });
}

let connection = null;
const domain = "pulsa.dpdns.org";   // sesuaikan dengan domain ejabberd Anda
const ws_url = "wss://pulsa.dpdns.org:5443/ws"; // WebSocket 5443

function log(msg) {
  console.log("[XMPP]", msg);
}

// ✅ Simpan kredensial ke localStorage
function saveCredentials(jid, pass) {
  console.log("Saving credentials to localStorage:", jid, pass);
  localStorage.setItem("xmpp_jid", jid);
  localStorage.setItem("xmpp_pass", pass);
}

// ✅ Ambil kredensial dari localStorage
function getCredentials() {
  return {
    jid: localStorage.getItem("xmpp_jid"),
    pass: localStorage.getItem("xmpp_pass"),
  };
}

// ✅ Hapus kredensial (saat logout / gagal login)
function clearCredentials() {
  console.log("Clearing credentials from localStorage");
  localStorage.removeItem("xmpp_jid");
  localStorage.removeItem("xmpp_pass");
}

let loginLocked = false; // 🚨 cegah spam login

// Fungsi untuk koneksi XMPP
function connectXMPP(jid, pass) {
  if (loginLocked) {
    log("Login temporarily locked, please wait...");
    return;
  }

  connection = new Strophe.Connection(ws_url);

  connection.connect(jid, pass, function(status) {
    console.log("[DEBUG] Strophe status:", status);
    switch(status) {
      case Strophe.Status.CONNECTING:
        log("Connecting...");
        break;
      case Strophe.Status.CONNFAIL:
        log("Connection failed.");
        break;
      case Strophe.Status.DISCONNECTING:
        log("Disconnecting...");
        break;
      case Strophe.Status.DISCONNECTED:
        log("Disconnected.");
        document.getElementById("logoutBtn").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
        break;
      case Strophe.Status.CONNECTED:
        log("Connected as " + connection.jid);
        document.getElementById("logoutBtn").style.display = "block";
        document.getElementById("loginForm").style.display = "none";

        // ✅ Simpan username + password hanya setelah berhasil login
        saveCredentials(jid, pass);
        break;
      case Strophe.Status.AUTHFAIL:
        log("Authentication failed.");
        clearCredentials(); // 🚨 hapus supaya tidak auto retry

        // 🚨 Lock login 5 detik untuk cegah brute force
        loginLocked = true;
        setTimeout(() => {
          loginLocked = false;
          log("Login unlocked, you can try again.");
        }, 5000);
        break;
      case Strophe.Status.ATTACHED:
        log("Attached.");
        break;
      case Strophe.Status.ERROR:
        log("Error occurred.");
        break;
      default:
        log("Other status: " + status);
    }
  });
}

// Event login manual
document.getElementById("loginForm").addEventListener("submit", function(e) {
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
document.getElementById("logoutBtn").addEventListener("click", function() {
  if (connection) {
    connection.disconnect();
    log("Manual logout.");
    clearCredentials(); // ✅ hapus dari localStorage
  }
});

// ✅ Auto login jika ada data tersimpan
window.addEventListener("load", () => {
  const creds = getCredentials();
  console.log("Loaded credentials from localStorage:", creds);
  if (creds.jid && creds.pass) {
    log("Found saved credentials, auto-logging in...");

    // isi otomatis ke input
    document.getElementById("username").value = creds.jid.split("@")[0];
    document.getElementById("password").value = creds.pass;

    // langsung coba connect
    connectXMPP(creds.jid, creds.pass);
  }
});
