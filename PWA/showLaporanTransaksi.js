import { connection } from "./xmpp.js";

let tanggalSekarang = null; // pakai let supaya bisa diubah

export function showLaporanTransaksi() {
    const laporanTransaksiBtn = document.getElementById("laporanTransaksiBtn");
    const today = new Date();

    // Ambil tanggal WIB (Asia/Jakarta)
    const wibDate = new Date(
        today.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );

    tanggalSekarang = wibDate.getDate();

    laporanTransaksiBtn.addEventListener("click", getLaporanTransaksi);
}

function getLaporanTransaksi() {
    kirimPesan(`laporan.${tanggalSekarang}`);
}

export function kirimPesan(isiPesan) {
    const to = "user1@pulsa.dpdns.org";
    const body = isiPesan;
    const message = $msg({ to: to, type: "chat" }).c("body").t(body);
    connection.send(message);
    console.log(`Pesan terkirim ke ${to}: ${body}`);
}

// === ketika menerima pesan masuk dari server ===
export function onMessage(msg) {
    const body = msg.getElementsByTagName("body")[0];
    if (body) {
        const responseText = Strophe.getText(body).trim();
        console.log("Jawaban server ke laporan trx:", responseText);

        // render laporan
        tampilkanLaporanTransaksi(responseText);
    }
    return true; // supaya listener tetap aktif
}

// === render laporan ke layar ===
function tampilkanLaporanTransaksi(dataText) {
    const container = document.getElementById("laporanTransaksiDisplay");
    if (!container) return;

    container.innerHTML = ""; // kosongkan dulu

    const lines = dataText.split("\n").map(l => l.trim()).filter(l => l);

    lines.forEach(line => {
        if (line.startsWith("Tgl")) {
            // === Header tanggal + tombol tutup ===
            const headerWrapper = document.createElement("div");
            headerWrapper.style.display = "flex";
            headerWrapper.style.justifyContent = "space-between";
            headerWrapper.style.alignItems = "center";
            headerWrapper.style.marginBottom = "0.3rem";

            // teks tanggal
            const headerText = document.createElement("div");
            headerText.style.fontWeight = "bold";
            headerText.textContent = line;

            // tombol tutup
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "Tutup Laporan";
            closeBtn.style.marginLeft = "1rem";
            closeBtn.style.fontSize = "0.8rem";
            closeBtn.style.padding = "0.2rem 0.5rem";
            closeBtn.style.borderRadius = "4px";
            closeBtn.style.cursor = "pointer";
            closeBtn.addEventListener("click", () => {
                container.innerHTML = "";
            });

            headerWrapper.appendChild(headerText);
            headerWrapper.appendChild(closeBtn);
            container.appendChild(headerWrapper);

        } else if (line.startsWith("#")) {
            const div = document.createElement("div");
            div.className = "laporan-item";

            // --- deteksi status ---
            let statusClass = "pending";
            if (line.includes("Sukses")) {
                statusClass = "success";
            } else if (line.includes("Gagal")) {
                statusClass = "failed";
            }
            div.classList.add(statusClass);

            // rapikan teks
            div.textContent = line.replace("Status=", "Status: ");
            container.appendChild(div);
        }
    });
}
