// file: notifikasiTransaksi.js
import { showToast } from "./utils.js";
import { showModalCustom } from "./modal.js";
import { kirimPesan } from "./xmppHelper.js";
import { normalizeRupiah } from "./utils.js";

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
            const nama = body.match(/NAMA\s*=\s*(.*)/i)?.[1] || "-";
            const noMeter = body.match(/NO\.METER\s*=\s*(.*)/i)?.[1] || "-";
            const tarif = body.match(/TARIF DAYA\s*=\s*(.*)/i)?.[1] || "-";

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
                                inputTujuan.dispatchEvent(new Event("input", { bubbles: true }));
                            }
                        }
                    }
                ]
            });
            return true;
        }

        // 🔹 Kasus khusus: CEK TAGIHAN PLN
        if (/CEK TAGIHAN PLN/i.test(body) && /NAMA=/i.test(body)) {
            // Ambil ID Pelanggan dari header
            const idMatch = body.match(/CEK TAGIHAN PLN ke\s+(\d+)/i);
            const idPelanggan = idMatch ? idMatch[1] : "-";

            // Ambil blok SN/Ref
            const snRefMatch = body.match(/SN\/Ref:\s*([^,]+)/i);
            if (snRefMatch) {
                const snRef = snRefMatch[1].trim();

                // Parse dengan delimiter '@'
                const parts = snRef.split("@");
                let data = {};
                parts.forEach(p => {
                    const [k, v] = p.split("=");
                    if (k && v) data[k.trim()] = v.trim();
                });

                const nama = data["NAMA"] || "-";
                const td = data["TD"] || "-";
                const jbln = data["JBLN"] || "-";
                const ptag = data["PTAG"] || "-";
                const tag = data["TAG"] || "0";
                const adm = data["ADM"] || "0";
                const ttag = data["TTAG"] || "0";

                // 🔹 Formatter Rupiah
                const formatRp = (val) => {
                    const num = normalizeRupiah(val);
                    return "Rp" + num.toLocaleString("id-ID");
                };

                const message = `<table class="detail-table-laporan-modal">
            <tr><td>ID Pelanggan</td><td>${idPelanggan}</td></tr>
            <tr><td>Nama</td><td>${nama}</td></tr>
            <tr><td>Tarif Daya</td><td>${td}</td></tr>
            <tr><td>Jumlah Bulan</td><td>${jbln}</td></tr>
            <tr><td>Periode Tagihan</td><td>${ptag}</td></tr>
            <tr><td>Tagihan</td><td>${formatRp(tag)}</td></tr>
            <tr><td>Biaya Admin</td><td>${formatRp(adm)}</td></tr>
            <tr><td>Total Tagihan</td><td>${formatRp(ttag)}</td></tr>
        </table>`;

                showModalCustom({
                    title: "Info Tagihan PLN",
                    message,
                    buttons: [
                        {
                            text: "BAYAR",
                            className: "modal-ok",
                            onClick: () => {
                                kirimPesan("pln." + idPelanggan);
                            }
                        },
                        {
                            text: "CANCEL",
                            className: "modal-cancel",
                            onClick: () => {
                                showToast("Pembayaran dibatalkan", "error");
                            }
                        }
                    ]
                });
                return true;
            }
        }


        // 🔹 Filter: hanya tampilkan jika mengandung kata harga/Harga/#Harga
        if (!/(?:#?Harga)/i.test(body)) {
            return true;
        }

        let type = "error";
        if (/SUKSES/i.test(body) || /DIPROSES/i.test(body)) {
            type = "success";
        }
        showToast(body, type, 5000);
    }
    return true;
}
