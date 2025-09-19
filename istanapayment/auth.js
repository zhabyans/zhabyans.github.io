//file auth.js
import { showToast, showLoadingModal, updateProgress } from "./utils.js";
import { connection, connectXMPP, log, clearCredentials } from "./xmpp.js";
export function setupAuth(domain) {

    // Ambil kredensial dari localStorage
    function getCredentials() {
        return {
            jid: localStorage.getItem("xmpp_jid"),
            pass: localStorage.getItem("xmpp_pass"),
        };
    }

    // Event login manual
    document.getElementById("formLogin").addEventListener("submit", function (e) {
        e.preventDefault();
        const loginBtn = this.querySelector('button[type="submit"]'); // tombol Login
        const user = document.getElementById("akune").value.toLowerCase();
        const pass = document.getElementById("paswote").value;

        if (!user || !pass) {
            showToast("Username dan password harus diisi", "error");
            return;
        }

        // 🔹 Disable tombol login, tunggu sampai unlock event
        loginBtn.disabled = true;
        loginBtn.textContent = "Tunggu...";

        const jid = user + "@" + domain;
        showLoadingModal();
        connectXMPP(jid, pass);
    });

    // 🔹 Listener: aktifkan tombol login saat xmpp.js bilang unlocked
    window.addEventListener("loginUnlocked", () => {
        const loginBtn = document.querySelector('#formLogin button[type="submit"]');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = "Login";
        }
    });

    // Auto login jika ada data tersimpan
    window.addEventListener("load", () => {
        const creds = getCredentials();
        console.log("Loaded credentials from localStorage:", creds);

        const loadingDiv = document.getElementById("loading");
        const formLogin = document.getElementById("formLogin");
        const homeDisplay = document.getElementById("homeDisplay");
        const saldoDisplay = document.getElementById("saldoDisplay");


        if (creds.jid && creds.pass) {
            log("Found saved credentials, auto-logging in...");

            // Isi otomatis ke input
            document.getElementById("akune").value = creds.jid.split("@")[0];
            document.getElementById("paswote").value = creds.pass;

            // 🔹 Tampilkan loading modal & reset progress
            showLoadingModal();
            updateProgress(0);

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
            formLogin.style.display = "block";
        }
    });

    // Event logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        console.log("Manual logout.");
        if (connection) {
            connection.disconnect();
            clearCredentials();
        }
    });
}