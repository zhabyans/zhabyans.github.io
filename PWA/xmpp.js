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
                saldoDisplay.style.display = "block";
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

                        // Tampilkan ke halaman dengan icon
                        document.getElementById("saldoDisplay").innerHTML = `
                           <header style="
                            margin-bottom:0.5rem;
                            display:grid; 
                            grid-template-columns: 1fr 1fr; 
                            text-align:center;
                            gap:0.5rem;
                        ">
                            <div>👤 <strong>${agen}</strong></div>
                            <div>🆔 <strong>${kodeAgen}</strong></div>
                        </header>
                        <div style="
                            display:grid; 
                            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                            gap:0.5rem;
                        ">
                            <div>💰 <strong>Saldo:</strong> ${saldo}</div>
                            <div>⚙️ <strong>Proses:</strong> ${proses}</div>
                            <div>📊 <strong>Transaksi:</strong> ${trx}</div>
                            <div>🎁 <strong>Bonus:</strong> ${bonus}</div>
                            <div>⭐ <strong>Poin:</strong> ${poin}</div>
                            <div>📅 <strong>Pemakaian:</strong> ${pemakaian}</div>
                        </div>
                            `;
                    }
                    return true;
                }

                // Pasang handler pesan
                connection.addHandler(handleMessage, null, "message", "chat", null, null);

                // -----------------------------
                // Tampilkan menu beranda

                if (home) {
                    home.style.display = "block"; // pastikan container beranda muncul
                }
                const menus = [
                    { name: "Pulsa", emoji: "📱" },
                    { name: "Paket Data", emoji: "🌐" },
                    { name: "Paket Nelpon", emoji: "📞" },
                    { name: "Token Listrik", emoji: "⚡" },
                    { name: "E-Wallet", emoji: "💳" },
                    { name: "Listrik Pascabayar", emoji: "💡" },
                    { name: "Bayar BPJS", emoji: "🏥" },
                    { name: "Bayar IndiHome", emoji: "📺" },
                    { name: "Voucher TV", emoji: "🎟️" }
                ];

                const menuGrid = document.getElementById("menuGrid");
                if (menuGrid) {
                    menuGrid.innerHTML = ""; // kosongkan dulu

                    menus.forEach(menu => {
                        const div = document.createElement("div");
                        div.className = "menu-item";
                        div.style.display = "flex";
                        div.style.flexDirection = "column";
                        div.style.alignItems = "center";
                        div.style.cursor = "pointer";

                        // emoji menu
                        const emojiSpan = document.createElement("span");
                        emojiSpan.textContent = menu.emoji;
                        emojiSpan.style.fontSize = "2rem"; // ukuran emoji lebih besar
                        emojiSpan.style.marginBottom = "0.5rem";

                        // nama menu
                        const p = document.createElement("p");
                        p.textContent = menu.name;
                        p.style.margin = "0";

                        div.appendChild(emojiSpan);
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
