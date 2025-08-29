// file: notifikasiTransaksi.js
import { showToast } from "./utils.js";
import { showModalCustom } from "./modal.js";
import { kirimPesan } from "./xmppHelper.js";

export function notifikasiTransaksi(msg) {
    const elems = msg.getElementsByTagName("body");

    if (elems.length > 0) {
        const body = elems[0].textContent.trim();

        // 🔹 Abaikan jika pesan adalah laporan saldo akun (bukan transaksi)
        if (/^Yth\.\s*AGEN PULSA/i.test(body) && /(Saldo|Bonus|Poin|Pemakaian)/i.test(body)) {
            return true;
        }

        // 🔹 Pesan tunggu/diproses
        if (/Mohon tunggu transaksi sebelumnya selesai/i.test(body) || /masih diproses operator/i.test(body)) {
            showToast(body, "success", 5000);
            return true;
        }

        // 🔹 Kasus khusus: CEKTOKEN (bukan laporan "Tgl.")
        if (/^CEKTOKEN/i.test(body) && /NAMA\s*=/i.test(body)) {
            // Ambil nilai pakai regex
            const nama = body.match(/NAMA\s*=\s*(.*)/i)?.[1] || "-";
            const noMeter = body.match(/NO\.METER\s*=\s*(.*)/i)?.[1] || "-";
            const tarif = body.match(/TARIF DAYA\s*=\s*(.*)/i)?.[1] || "-";

            // Format jadi tabel
            const message = `<table class="detail-table-laporan-modal">
                <tr><td>Nama</td><td>${nama}</td></tr>
                <tr><td>No. Meter</td><td>${noMeter}</td></tr>
                <tr><td>Tarif Daya</td><td>${tarif}</td></tr>
            </table>`;

            showModalCustom({
                title: "Info Nomor Token Pelanggan",
                message,
                buttons: [
                    {
                        text: "OK",
                        className: "modal-ok",
                        onClick: () => {
                            const inputTujuan = document.getElementById("inputTujuan");
                            kirimPesan("harga.p");
                            if (inputTujuan && !inputTujuan.value.trim()) {
                                inputTujuan.value = noMeter;
                                // 🔹 trigger event input supaya semua handler jalan
                                inputTujuan.dispatchEvent(new Event("input", { bubbles: true }));
                            }
                        }
                    }
                ]
            });
            return true;
        }

        // 🔹 Filter: hanya tampilkan jika mengandung kata harga/Harga/#Harga
        if (!/(?:#?Harga)/i.test(body)) {
            return true;
        }

        // 🔹 Cek status (default error → merah)
        let type = "error";
        if (/SUKSES/i.test(body) || /DIPROSES/i.test(body)) {
            type = "success";
        }

        // 🔹 Tampilkan toast
        showToast(body, type, 5000);
    }
    return true;
}
