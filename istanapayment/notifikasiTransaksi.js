import { showToast } from "./utils.js";

export function notifikasiTransaksi(msg) {
    console.log("[NOTIFIKASI] Pesan diterima:", msg);
    const elems = msg.getElementsByTagName("body");

    if (elems.length > 0) {
        const body = elems[0].textContent.trim();
        console.log("[NOTIFIKASI] body:", body);

        // 🔹 Abaikan jika pesan adalah laporan saldo akun (bukan transaksi)
        if (/^Yth\.\s*AGEN PULSA/i.test(body) && /(Saldo|Bonus|Poin|Pemakaian)/i.test(body)) {
            console.log("[NOTIFIKASI] Pesan laporan saldo akun → diabaikan");
            return true;
        }

        // 🔹 Kasus khusus: pesan "Mohon tunggu..." atau "masih diproses operator"
        if (/Mohon tunggu transaksi sebelumnya selesai/i.test(body) || /masih diproses operator/i.test(body)) {
            console.log("[NOTIFIKASI] Pesan status tunggu/diproses → tampilkan hijau");
            showToast(body, "success", 5000);
            return true;
        }

        // 🔹 Filter: hanya tampilkan jika mengandung kata harga/Harga/#Harga
        if (!/(?:#?Harga)/i.test(body)) {
            console.log("[NOTIFIKASI] Pesan diabaikan karena tidak mengandung kata 'harga' atau '#harga'");
            return true; // abaikan pesan lain, tetap aktif
        }

        // 🔹 Cek status (default error → merah)
        let type = "error";
        if (/SUKSES/i.test(body) || /DIPROSES/i.test(body)) {
            type = "success"; // hijau jika sukses atau sedang diproses
        }

        // 🔹 Tampilkan toast
        showToast(body, type, 5000);
    }
    return true; // agar handler tetap aktif
}
