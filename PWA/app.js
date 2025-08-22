// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => console.log("Service Worker registered:", reg.scope))
      .catch((err) => console.log("Service Worker failed:", err));
  });
}

let connection = null;
const domain = "pulsa.dpdns.org";   // sesuaikan dengan domain ejabberd Anda
const ws_url = "wss://pulsa.dpdns.org:5443/ws"; // WebSocket 5443

function log(msg) {
  console.log(msg);
}

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (!user || !pass) {
    alert("Username dan password harus diisi");
    return;
  }

  connection = new Strophe.Connection(ws_url);

  connection.connect(user + "@" + domain, pass, function(status) {
    if (status === Strophe.Status.CONNECTING) {
      log("Connecting...");
    } else if (status === Strophe.Status.CONNFAIL) {
      log("Connection failed.");
    } else if (status === Strophe.Status.DISCONNECTING) {
      log("Disconnecting...");
    } else if (status === Strophe.Status.DISCONNECTED) {
      log("Disconnected.");
      document.getElementById("logoutBtn").style.display = "none";
      document.getElementById("loginForm").style.display = "block";
    } else if (status === Strophe.Status.CONNECTED) {
      log("Connected as " + connection.jid);
      document.getElementById("logoutBtn").style.display = "block";
      document.getElementById("loginForm").style.display = "none";
    } else if (status === Strophe.Status.AUTHFAIL) {
      log("Authentication failed.");
    } else if (status === Strophe.Status.ATTACHED) {
      log("Attached.");
    } else if (status === Strophe.Status.ERROR) {
      log("Error.");
    }
  });
});

document.getElementById("logoutBtn").addEventListener("click", function() {
  if (connection) {
    connection.disconnect();
    log("Manual logout.");
  }
});
