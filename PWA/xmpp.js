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
export function connectXMPP(jid, pass, sudahKonek = null) {
    if (loginLocked) {
        log("Login temporarily locked, please wait...");
        return;
    }

    connection = new Strophe.Connection(ws_url);
    const saldoDisplay = document.getElementById("saldoDisplay");
    const home = document.getElementById("home");
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
                document.getElementById("loginForm").style.display = "block";
                saldoDisplay.style.display = "none";
                home.style.display = "none";
                break;
            case Strophe.Status.CONNECTED:
                log("Connected as " + connection.jid);
                connection.send($pres());
                document.getElementById("logoutBtn").style.display = "block";
                document.getElementById("loginForm").style.display = "none";

                saveCredentials(jid, pass);

                // kirim pesan otomatis ke user1
                const to = "user1@pulsa.dpdns.org";
                const body = "S"; // pesan yang dikirim
                const message = $msg({ to: to, type: "chat" }).c("body").t(body);
                connection.send(message);
                log(`Pesan terkirim ke ${to}: ${body}`);

                function handleMessage(msg) {
                    console.log("[DEBUG] Pesan diterima:", msg);
                    const from = msg.getAttribute("from");
                    const type = msg.getAttribute("type");
                    const elems = msg.getElementsByTagName("body");

                    if (elems.length > 0) {
                        const body = elems[0].textContent;
                        console.log("[DEBUG] body:", body);

                        // Ambil nama agen dan kode
                        const agenMatch = body.match(/Yth\.\s+([^-]+)-\s*([A-Z0-9]+)/);
                        const agen = agenMatch ? agenMatch[1].trim() : "tidak diketahui";
                        const kodeAgen = agenMatch ? agenMatch[2].trim() : "tidak diketahui";

                        // Ambil field lain
                        const saldoMatch = body.match(/Saldo\s([\d.]+)/);
                        const prosesMatch = body.match(/Proses\s([\d.]+)/);
                        const trxMatch = body.match(/Trx\s([\d.]+)/i);
                        const bonusMatch = body.match(/Bonus\s([\d.]+)/);
                        const poinMatch = body.match(/Poin\s([\d.]+)/i);
                        const pemakaianMatch = body.match(/Pemakaian\s([\d.]+)/i);

                        const saldo = saldoMatch ? saldoMatch[1] : "-";
                        const proses = prosesMatch ? prosesMatch[1] : "-";
                        const trx = trxMatch ? trxMatch[1] : "-";
                        const bonus = bonusMatch ? bonusMatch[1] : "-";
                        const poin = poinMatch ? poinMatch[1] : "-";
                        const pemakaian = pemakaianMatch ? pemakaianMatch[1] : "-";

                        // Tampilkan ke halaman
                        saldoDisplay.textContent =
                            `${agen} (${kodeAgen}) | Saldo: ${saldo} | Masih Proses: ${proses} | Jumlah Transaksi: ${trx} | Bonus: ${bonus} | Poin: ${poin} | Pemakaian Hari ini: ${pemakaian}`;
                    }
                    return true;
                }

                // Pasang handler pesan
                connection.addHandler(handleMessage, null, "message", "chat", null, null);
                saldoDisplay.style.display = "block";
                // -----------------------------
                // Tampilkan menu beranda

                if (home) {
                    home.style.display = "block"; // pastikan container beranda muncul
                }

                const menus = [
                    { name: "Pulsa", icon: "icons/icon-192.png" },
                    { name: "Paket Data", icon: "icons/icon-192.png" },
                    { name: "Paket Nelpon", icon: "icons/icon-192.png" },
                    { name: "Token Listrik", icon: "icons/icon-192.png" },
                    { name: "E-Wallet", icon: "icons/icon-192.png" },
                    { name: "Listrik Pascabayar", icon: "icons/icon-192.png" },
                    { name: "Bayar BPJS", icon: "icons/icon-192.png" },
                    { name: "Bayar IndiHome", icon: "icons/icon-192.png" },
                    { name: "Voucher TV", icon: "icons/icon-192.png" }
                ];

                const menuGrid = document.getElementById("menuGrid");
                if (menuGrid) {
                    menuGrid.innerHTML = ""; // kosongkan dulu

                    menus.forEach(menu => {
                        const div = document.createElement("div");
                        div.className = "menu-item";

                        // gambar menu
                        const img = document.createElement("img");
                        img.src = menu.icon;
                        img.alt = menu.name;
                        img.style.width = "48px";
                        img.style.height = "48px";
                        img.style.objectFit = "contain";
                        img.style.marginBottom = "0.5rem";

                        // nama menu
                        const p = document.createElement("p");
                        p.textContent = menu.name;
                        p.style.margin = "0"; // supaya rapih

                        div.appendChild(img);
                        div.appendChild(p);
                        menuGrid.appendChild(div);

                        // Event klik menu
                        div.addEventListener("click", () => {
                            alert("Klik menu: " + menu.name);
                        });
                    });
                }
                // -----------------------------

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

// Export utilities jika dibutuhkan di app.js
export { log, saveCredentials, clearCredentials };
