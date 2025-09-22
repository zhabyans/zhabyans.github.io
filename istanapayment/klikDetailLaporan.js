// file: klikDetailLaporan.js
import { showModalCustom } from "./modal.js";
import { normalizeRupiah } from "./utils.js";
import { shareStruk } from "./shareStruk.js";
import { getHargaJual } from "./hargaJualMap.js";
import { printThermalStruk } from "./printThermal.js"; // ⬅️ import baru

export async function klikDetailLaporan(parsed, tanggal) {
    const hargaModal = normalizeRupiah(parsed.harga);
    const kode = parsed.kode ? parsed.kode.toLowerCase() : "";

    // hitung harga jual pakai aturan baru
    let hargaJual = getHargaJual(kode, hargaModal); // let supaya bisa diubah

    const keuntungan = () => hargaJual - hargaModal; // fungsi biar update otomatis

    // buat ID unik untuk elemen hargaJual supaya bisa diakses
    const hargaJualId = "hargaJualInput";

    const message = `<table class="detail-table-laporan-modal">
<tr><td>Waktu Pengisian</td><td>${tanggal} ${parsed.waktu}</td></tr>
<tr><td>Kode Produk</td><td>${parsed.kode}</td></tr>
<tr><td>Nomor Tujuan</td><td>${parsed.tujuan}</td></tr>
<tr><td>Serial Number</td><td>${parsed.sn}</td></tr>
<tr><td>Status Transaksi</td><td>${parsed.status}</td></tr>
</table>
<table class="detail-table-laporan-modal">
<tr><td>Harga Modal</td><td>Rp${hargaModal.toLocaleString("id-ID")}</td></tr>
<tr><td>Saran Harga Jual</td><td><span id="editHarga" style="cursor:pointer;">✏️ </span><span id="${hargaJualId}">Rp${hargaJual.toLocaleString("id-ID")}</span></td></tr>
<tr><td>Keuntungan</td><td id="keuntungan">Rp${keuntungan().toLocaleString("id-ID")}</td></tr>
</table>`;

    const invalidSN = ["-", "NA", "N/A", "n/a", "N.A", "Update", "UPDATE"];
    const isSNInvalid = invalidSN.includes((parsed.sn || "").trim());

    showModalCustom({
        title: "DETAIL TRANSAKSI",
        message,
        buttons: [
            {
                text: "🖼️ Bagikan",
                className: "modal-share",
                onClick: () => shareStruk(parsed, tanggal, hargaJual),
                disabled: isSNInvalid
            },
            {
                text: "📝 Komplain",
                className: "modal-complain",
                onClick: () => {
                    const pesan = `Mohon bantu cek transaksi berikut:

Tanggal : ${tanggal} jam ${parsed.waktu}
Kode Produk : ${parsed.kode}
Tujuan : ${parsed.tujuan}
Serial Number : ${parsed.sn}
Status : ${parsed.status}
Terima kasih.
`;
                    const nomorWA = "6283100100190";
                    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
                    window.open(url, "_blank");
                }
            },
            {
                text: "🖨️ Print",
                className: "modal-print",
                onClick: () => printThermalStruk(parsed, tanggal, hargaJual),
                disabled: isSNInvalid
            }
        ]
    });

    // 🔹 Tambahkan listener klik untuk emoji edit
    const editBtn = document.getElementById("editHarga");
    editBtn.onclick = () => {
        // sembunyikan tombol edit
        editBtn.style.display = "none";

        const hargaSpan = document.getElementById(hargaJualId);
        const currentVal = hargaJual;

        hargaSpan.innerHTML = `<input id="inputHargaInline" type="text" value="${currentVal.toLocaleString("id-ID")}" style="padding:0; margin:0; width:70px; height:1.2em; line-height:1.2em; border:1px solid #ccc; vertical-align:middle; text-align:right;"><span id="btnSimpanInline" style="cursor:pointer; margin-left:4px;">✅</span><span id="btnBatalInline" style="cursor:pointer; margin-left:4px;">❌</span>`;

        const inputEl = document.getElementById("inputHargaInline");

        // 🔹 Format ribuan otomatis saat mengetik
        inputEl.addEventListener("input", () => {
            let raw = inputEl.value.replace(/\D/g, ""); // hanya angka
            if (raw) {
                inputEl.value = parseInt(raw, 10).toLocaleString("id-ID");
            } else {
                inputEl.value = "";
            }
        });

        document.getElementById("btnSimpanInline").onclick = () => {
            let raw = inputEl.value.replace(/\D/g, ""); // ambil angka asli
            const val = parseFloat(raw);
            if (!isNaN(val) && val > 0) {
                hargaJual = val;
                hargaSpan.textContent = "Rp" + hargaJual.toLocaleString("id-ID");
                document.getElementById("keuntungan").textContent =
                    "Rp" + (hargaJual - hargaModal).toLocaleString("id-ID");
            } else {
                alert("Harga tidak valid!");
                hargaSpan.textContent = "Rp" + hargaJual.toLocaleString("id-ID");
            }
            // tampilkan kembali tombol edit
            editBtn.style.display = "inline";
        };

        document.getElementById("btnBatalInline").onclick = () => {
            hargaSpan.textContent = "Rp" + hargaJual.toLocaleString("id-ID");
            // tampilkan kembali tombol edit
            editBtn.style.display = "inline";
        };
    };

}
