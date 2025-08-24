import { connection } from "./xmpp.js";
import { renderLaporanHeader } from "./renderLaporanHeader.js";

const laporanTransaksiDisplay = document.getElementById("laporanTransaksiDisplay");
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
    laporanTransaksiDisplay.style.display = "block";
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

window.laporanTerbuka = false; // flag global

// === helper untuk parse baris laporan ===
function parseLaporanLine(line) {
    // format dasar: 
    // #(kode) ke (nomorTujuan) Rp.(harga) #(SN) @(waktu) Status=(status)
    const regex = /^#(\S+)\s+ke\s+(\S+)\s+Rp\.([\d.]+)\s+#(.*?)\s+@(\d{2}:\d{2})\s+Status=(.*?);?$/;
    const match = line.match(regex);

    if (!match) {
        return null; // tidak sesuai format
    }

    return {
        kode: match[1],
        tujuan: match[2],
        harga: match[3],
        sn: match[4] === "" ? "-" : match[4],
        waktu: match[5],
        status: match[6]
    };
}

// === render laporan ke layar ===
function tampilkanLaporanTransaksi(dataText) {
    const header = document.getElementById("laporanHeader");
    const list = document.getElementById("laporanList");
    if (!list) return;

    const lines = dataText.split("\n").map(l => l.trim()).filter(l => l);

    if (window.laporanTerbuka && !lines.some(l => l.startsWith("Tgl"))) {
        console.log("Respon diabaikan karena laporan sedang terbuka:", dataText);
        return;
    }

    list.innerHTML = "";

    lines.forEach(line => {
        if (line.startsWith("Tgl")) {
            renderLaporanHeader(line, header, list);
        } else if (line.startsWith("#")) {
            const parsed = parseLaporanLine(line);
            if (!parsed) return;

            const div = document.createElement("div");
            div.className = "laporan-item";
            div.style.display = "grid";
            div.style.gridTemplateColumns = "1fr auto";
            div.style.alignItems = "flex-start";
            div.style.padding = "0.25rem 0.5rem";
            div.style.borderBottom = "1px solid #ddd";
            div.style.gap = "0.5rem";
            div.style.fontSize = "0.85rem"; // lebih ringkas

            // kiri: kode, tujuan, harga, SN
            const left = document.createElement("div");
            left.style.wordBreak = "break-word";
            left.style.overflowWrap = "anywhere";
            left.style.minWidth = "0";
            left.innerHTML = `
                <div><b>${parsed.kode}</b> → ${parsed.tujuan} → Rp.${parsed.harga}</div>
                <div>SN: ${parsed.sn}</div>
            `;

            // kanan: waktu + status
            const right = document.createElement("div");
            right.style.display = "flex";
            right.style.flexDirection = "column";
            right.style.alignItems = "flex-end";
            right.style.whiteSpace = "nowrap";
            right.innerHTML = `
                <div style="font-weight:bold">${parsed.waktu}</div>
                <div>${parsed.status}</div>
            `;

            // status warna
            if (parsed.status.toLowerCase().includes("sukses")) {
                div.classList.add("success");
            } else if (parsed.status.toLowerCase().includes("gagal")) {
                div.classList.add("failed");
            } else {
                div.classList.add("pending");
            }

            div.appendChild(left);
            div.appendChild(right);
            list.appendChild(div);
        }
    });
}
