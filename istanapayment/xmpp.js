//file xmpp.js
import { getDataAkun } from "./getDataAkun.js";
import { showMenuKotak } from "./showMenuKotak.js";
import { showLaporanTransaksi } from "./showLaporanTransaksi.js";
import { laporanHandler } from "./showLaporanTransaksi.js";
import { menuHandler } from "./showMenuKotak.js";
import { kirimPesan } from "./xmppHelper.js";
import { notifikasiTransaksi } from "./notifikasiTransaksi.js";
import { checkPin } from "./pin.js";
import { showToast, updateProgress, hideLoadingModal } from "./utils.js";

export let connection = null;
export let loginLocked = false; // cegah spam login
// const ws_url = "wss://pulsa.dpdns.org:5443/ws"; // WebSocket 5443
const ws_url = "wss://pulsa.dpdns.org:7443/ws"; // WebSocket 7443
const saldoDisplay = document.getElementById("saldoDisplay");
const homeDisplay = document.getElementById("homeDisplay");
const navBottom = document.getElementById("navBottom");

// Utility log
function log(msg) {
    console.log("[XMPP]", msg);
}

// Simpan kredensial ke localStorage
function saveCredentials(jid, pass) {
    // console.log("Saving credentials to localStorage:", jid, pass);
    localStorage.setItem("xmpp_jid", jid);
    localStorage.setItem("xmpp_pass", pass);
}

// Hapus kredensial
function clearCredentials() {
    // console.log("Clearing credentials from localStorage");
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

    connection.connect(jid + "/", pass, function (status) {
        console.log("[DEBUG] Strophe status:", status);
        switch (status) {
            case Strophe.Status.CONNECTING:
                console.log("Connecting...");
                updateProgress(50);
                break;
            case Strophe.Status.CONNFAIL:
                console.log("Connection failed.");
                updateProgress(100);
                hideLoadingModal();
                break;
            case Strophe.Status.DISCONNECTING:
                console.log("Disconnecting...");
                break;
            case Strophe.Status.DISCONNECTED:
                console.log("Disconnected.");
                updateProgress(0);
                hideLoadingModal();
                document.getElementById("formLogin").style.display = "block";
                saldoDisplay.style.display = "none";
                homeDisplay.style.display = "none";
                navBottom.style.display = "none";
                laporanTransaksiDisplay.style.display = "none";
                document.getElementById("akunDisplay").style.display = "none";
                break;
            case Strophe.Status.CONNECTED:
                console.log("Connected as " + connection.jid);
                updateProgress(100);
                hideLoadingModal();
                connection.send(
                    $pres().c("priority").t("127") // 🔹 priority = 127
                );
                document.getElementById("formLogin").style.display = "none";

                saveCredentials(jid, pass);

                kirimPesan("S");
                saldoDisplay.style.display = "block";

                connection.addHandler(getDataAkun, null, "message", "chat");
                connection.addHandler(laporanHandler, null, "message", "chat");
                connection.addHandler(menuHandler, null, "message", "chat");
                connection.addHandler(notifikasiTransaksi, null, "message", "chat");

                homeDisplay.style.display = "block";
                navBottom.style.display = "flex";
                showMenuKotak();
                showLaporanTransaksi();

                // 🔹 Reset navigasi ke Beranda
                const navButtons = document.querySelectorAll(".bottom-nav .nav-item");
                navButtons.forEach(b => b.classList.remove("active"));
                document.getElementById("navBeranda").classList.add("active");
                document.getElementById("pinOverlay").style.display = "flex";
                checkPin();
                window.dispatchEvent(new Event("loginUnlocked"));
                if (sudahKonek) sudahKonek(); // panggil callback jika ada
                break;

            case Strophe.Status.AUTHFAIL:
                console.log("Authentication failed.");
                clearCredentials();
                showToast("Login Gagal\nPeriksa Username dan Password!", "error");
                updateProgress(100);
                hideLoadingModal();
                loginLocked = true;
                setTimeout(() => {
                    loginLocked = false;
                    console.log("Login unlocked, you can try again.");
                    // 🔹 Trigger event supaya auth.js tahu
                    window.dispatchEvent(new Event("loginUnlocked"));
                }, 5000);
                break;

            case Strophe.Status.ATTACHED:
                console.log("Attached.");
                break;
            case Strophe.Status.ERROR:
                console.log("Error occurred.");
                break;
            default:
                console.log("Other status: " + status);
        }
    });
}

export { log, saveCredentials, clearCredentials };