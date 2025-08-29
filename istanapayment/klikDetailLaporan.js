// file klikDetailLaporan.js
import { showModalCustom } from "./modal.js";
import { normalizeRupiah } from "./utils.js";
import { printStruk } from "./printStruk.js"; // import fungsi print
import { hargaJualMap } from "./hargaJualMap.js";

export async function klikDetailLaporan(parsed, tanggal) {
    const hargaModal = normalizeRupiah(parsed.harga);

    // normalisasi kode jadi lowercase supaya aman
    const kode = parsed.kode ? parsed.kode.toLowerCase() : "";

    // tentukan harga jual
    let hargaJual;
    if (hargaJualMap[kode]) {
        hargaJual = hargaJualMap[kode];
    } else {
        hargaJual = hargaModal; // fallback default
    }

    const keuntungan = hargaJual - hargaModal;

    const message = `<table class="detail-table-laporan-modal">
    <tr><td>Waktu Pengisian</td><td>${tanggal} ${parsed.waktu}</td></tr>
    <tr><td>Kode Produk</td><td>${parsed.kode}</td></tr>
    <tr><td>Nomor Tujuan</td><td>${parsed.tujuan}</td></tr>
    <tr><td>Serial Number</td><td>${parsed.sn}</td></tr>
    <tr><td>Status Transaksi</td><td>${parsed.status}</td></tr>
    </table>
    <table class="detail-table-laporan-modal">
    <tr><td>Harga Modal</td><td>Rp${hargaModal.toLocaleString("id-ID")}</td></tr>
    <tr><td>Saran Harga Jual</td><td>Rp${hargaJual.toLocaleString("id-ID")}</td></tr>
    <tr><td>Keuntungan</td><td>Rp${keuntungan.toLocaleString("id-ID")}</td></tr>
</table>`;

    showModalCustom({
        title: "DETAIL TRANSAKSI",
        message,
        buttons: [
            {
                text: "Bagikan",
                className: "modal-ok",
                onClick: () => printStruk(parsed, tanggal)
            },
            {
                text: "Komplain",
                className: "modal-cancel",
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
                text: "Close dulu",
                className: "modal-ok",
                onClick: () => console.log("Set Harga Jual:", parsed)
            }
        ]
    });
}
