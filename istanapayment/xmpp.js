import { getDataAkun } from "./getDataAkun.js";
import { showMenuKotak } from "./showMenuKotak.js";
import { showLaporanTransaksi } from "./showLaporanTransaksi.js";
import { laporanHandler } from "./showLaporanTransaksi.js";
import { menuHandler } from "./showMenuKotak.js";
import { kirimPesan } from "./xmppHelper.js";
import { notifikasiTransaksi } from "./notifikasiTransaksi.js";

export let connection = null;
export let loginLocked = false; // cegah spam login
const ws_url = "wss://pulsa.dpdns.org:5443/ws"; // WebSocket 5443
const saldoDisplay = document.getElementById("saldoDisplay");
const homeDisplay = document.getElementById("homeDisplay");

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
export function connectXMPP(jid, pass, sudahKonek = null) {
    if (loginLocked) {
        log("Login temporarily locked, please wait...");
        return;
    }

    connection = new Strophe.Connection(ws_url);
    connection.connect(jid + "/asd", pass, function (status) {
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
                document.getElementById("masukDisplay").style.display = "block";
                saldoDisplay.style.display = "none";
                homeDisplay.style.display = "none";
                document.getElementById("laporanTransaksiBtn").style.display = "none";
                laporanTransaksiDisplay.style.display = "none";
                break;
            case Strophe.Status.CONNECTED:
                log("Connected as " + connection.jid);
                connection.send($pres());
                document.getElementById("logoutBtn").style.display = "block";
                document.getElementById("laporanTransaksiBtn").style.display = "inline-block";
                document.getElementById("masukDisplay").style.display = "none";

                saveCredentials(jid, pass);

                kirimPesan("S");
                
                saldoDisplay.style.display = "block";

                connection.addHandler(getDataAkun, null, "message", "chat");
                connection.addHandler(laporanHandler, null, "message", "chat");
                connection.addHandler(menuHandler, null, "message", "chat");
                connection.addHandler(notifikasiTransaksi, null, "message", "chat");

                homeDisplay.style.display = "block";
                showMenuKotak();
                showLaporanTransaksi();

                if (sudahKonek) sudahKonek(); // panggil callback jika ada
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

export { log, saveCredentials, clearCredentials };