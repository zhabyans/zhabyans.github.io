import { renderLaporanHeader } from "./renderLaporanHeader.js";
import { renderLaporanItem } from "./renderLaporanItem.js";
import { kirimPesan, onMessage } from "./xmppHelper.js";

// handler untuk laporan
export const laporanHandler = onMessage((responseText) => {
    tampilkanLaporanTransaksi(responseText);
});

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

export function getLaporanTransaksi() {
    kirimPesan(`laporan.${tanggalSekarang}`);
    laporanTransaksiDisplay.style.display = "block";
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
            renderLaporanItem(parsed, list);
        }
    });

}
