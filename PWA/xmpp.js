// xmpp.js
export let connection = null;
export let loginLocked = false; // cegah spam login
const ws_url = "wss://pulsa.dpdns.org:5443/ws"; // WebSocket 5443

// Utility log
function log(msg) {
    console.log("[XMPP]", msg);
}

// Simpan kredensial ke localStorage
function saveCredentials(jid, pass) {
    console.log("Saving credentials to localStorage:", jid, pass);
    localStorage.setItem("xmpp_jid", jid);
    localStorage.setItem("xmpp_pass", pass);
}

// Hapus kredensial
function clearCredentials() {
    console.log("Clearing credentials from localStorage");
    localStorage.removeItem("xmpp_jid");
    localStorage.removeItem("xmpp_pass");
}

// Fungsi koneksi XMPP
export function connectXMPP(jid, pass, onConnected = null) {
    if (loginLocked) {
        log("Login temporarily locked, please wait...");
        return;
    }

    connection = new Strophe.Connection(ws_url);

    connection.connect(jid, pass, function (status) {
        console.log("[DEBUG] Strophe status:", status);
        switch (status) {
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

                saveCredentials(jid, pass);

                if (onConnected) onConnected(); // panggil callback
                break;
            case Strophe.Status.AUTHFAIL:
                log("Authentication failed.");
                clearCredentials();

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

// Export utilities jika dibutuhkan di app.js
export { log, saveCredentials, clearCredentials };
