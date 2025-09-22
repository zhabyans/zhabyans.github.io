//file auth.js
import { showToast, showLoadingModal, updateProgress } from "./utils.js";
import { connection, connectXMPP, log, clearCredentials, loadCredentials } from "./xmpp.js";
export function setupAuth(domain) {

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
        const creds = loadCredentials(); // 🔹 pakai dekripsi

        console.log("Loaded credentials from localStorage:", creds);

        if (creds && creds.jid && creds.pass) {
            log("Found saved credentials, auto-logging in...");

            document.getElementById("akune").value = creds.jid.split("@")[0];
            document.getElementById("paswote").value = creds.pass;

            showLoadingModal();
            updateProgress(0);

            connectXMPP(creds.jid, creds.pass, () => {
                document.getElementById("loading").style.display = "none";
            });
        } else {
            // kalau gak ada, tampilkan form login
            document.getElementById("loading").style.display = "none";
            document.getElementById("formLogin").style.display = "block";
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