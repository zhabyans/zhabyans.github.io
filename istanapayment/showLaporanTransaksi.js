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
    const navRiwayat = document.getElementById("navRiwayat");
    const today = new Date();

    // Ambil tanggal WIB (Asia/Jakarta)
    const wibDate = new Date(
        today.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );

    tanggalSekarang = wibDate.getDate();
    navRiwayat.addEventListener("click", getLaporanTransaksi);
}

export function getLaporanTransaksi() {
    kirimPesan(`laporan.${tanggalSekarang}`);
    laporanTransaksiDisplay.style.display = "block";
}

window.laporanTerbuka = false; // flag global

// === helper untuk parse baris laporan ===
function parseLaporanLine(line) {
    const regex = /^#(\S+)\s+ke\s+(\S+)\s+Rp\.([\d.]+)\s+#([\s\S]*?)\s*@(\d{2}:\d{2})\s+Status=([^;]+);?$/i;
    const match = line.match(regex);

    if (!match) return null;

    let sn = match[4].trim();
    if (sn === "") sn = "-";

    // ✨ filter khusus untuk CEKTOKEN
    if (match[1] === "CEKTOKEN" && sn.includes("NAMA =")) {
        // ambil hanya baris identitas (NAMA, NO.METER, TARIF DAYA)
        const identitasMatch = sn.match(/NAMA\s*=\s*.*?NO\.METER\s*=\s*.*?TARIF DAYA\s*=\s*.*?(?=$|UNTUK)/s);
        if (identitasMatch) {
            sn = identitasMatch[0]
                .replace(/\s+/g, " ") // rapikan spasi
                .trim();
        }
    }

    return {
        kode: match[1],
        tujuan: match[2],
        harga: match[3],
        sn,
        waktu: match[5],
        status: match[6].trim()
    };
}


// === render laporan ke layar ===
function tampilkanLaporanTransaksi(dataText) {
    const header = document.getElementById("laporanHeader");
    const list = document.getElementById("laporanList");
    if (!list) return;

    const rawLines = dataText.split("\n").map(l => l.trim());
    const lines = rawLines.filter(l => l);

    // jika laporan sedang terbuka dan tidak ada baris Tgl → abaikan
    if (window.laporanTerbuka && !lines.some(l => l.startsWith("Tgl"))) {
        console.log("Respon diabaikan karena laporan sedang terbuka:", dataText);
        return;
    }

    list.innerHTML = "";

    const ambilTanggal = lines.find(l => l.startsWith("Tgl")) || "";
    const tanggalSaja = ambilTanggal.replace(/^Tgl\.\s*/, "").replace("N/A", "").trim();

    let buffer = ""; // untuk gabung multiline transaksi
    lines.forEach(line => {
        if (line.startsWith("Tgl")) {
            if (line.includes("N/A")) {
                // contoh: "Tgl. 27/08/25N/A"
                const tanggal = line.replace("N/A", "").trim();
                renderLaporanHeader(tanggal, header, list);

                // tampilkan pesan "belum tersedia"
                const info = document.createElement("div");
                info.textContent = "Belum ada transaksi";
                info.style.textAlign = "center";
                info.style.padding = "1rem";
                info.style.color = "#666";
                list.appendChild(info);
            } else {
                renderLaporanHeader(line, header, list);
            }
        } else if (line.startsWith("#")) {
            buffer = line; // mulai kumpulin
            if (line.includes("Status=")) {
                // single line transaksi
                const parsed = parseLaporanLine(buffer);
                if (parsed) renderLaporanItem(parsed, list, tanggalSaja);
                buffer = "";
            }
        } else if (buffer) {
            buffer += " " + line; // gabung baris tambahan
            if (line.includes("Status=")) {
                // selesai kumpulin → parse
                const parsed = parseLaporanLine(buffer);
                if (parsed) renderLaporanItem(parsed, list, tanggalSaja);
                else console.warn("❌ Gagal parse:", buffer);
                buffer = "";
            }
        }
    });
}

