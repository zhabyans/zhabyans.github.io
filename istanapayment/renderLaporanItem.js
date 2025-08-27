import { showModalCustom } from "./modal.js";
import { normalizeRupiah } from "./utils.js";

export function renderLaporanItem(parsed, list) {
    if (!parsed || !list) return;

    const div = document.createElement("div");
    div.className = "laporan-item";
    div.style.display = "grid";
    div.style.gridTemplateColumns = "1fr auto";
    div.style.alignItems = "flex-start";
    div.style.padding = "0.25rem 0.5rem";
    div.style.borderBottom = "1px solid #ddd";
    div.style.gap = "0.5rem";
    div.style.fontSize = "0.85rem";

    // kiri
    const left = document.createElement("div");
    left.innerHTML = `
        <div><b>${parsed.kode}</b> → ${parsed.tujuan} → Rp.${parsed.harga}</div>
        <div>SN: ${parsed.sn}</div>
    `;

    // kanan
    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.flexDirection = "column";
    right.style.alignItems = "flex-end";
    right.style.whiteSpace = "nowrap";
    right.innerHTML = `
        <div style="font-weight:bold">${parsed.waktu}</div>
        <div>${parsed.status}</div>
    `;

    // warna status
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

    // === event klik untuk tampilkan modal detail ===
    div.addEventListener("click", () => {
        const hargaModal = normalizeRupiah(parsed.harga); // ✅ bersih dari Rp dan titik
        const hargaJual = hargaModal + 2000;
        const keuntungan = hargaJual - hargaModal;

        const message = `<table class="detail-table-laporan-modal">
        <tr><td>Waktu Pengisian</td><td>${parsed.waktu}</td></tr>
        <tr><td>Kode Produk</td><td>${parsed.kode}</td></tr>
        <tr><td>Nomor Tujuan</td><td>${parsed.tujuan}</td></tr>
        <tr><td>Serial Number</td><td>${parsed.sn}</td></tr>
        <tr><td>Harga Modal</td><td>Rp${hargaModal.toLocaleString("id-ID")}</td></tr>
        <tr><td>Status Transaksi</td><td>${parsed.status}</td></tr>
    </table>
    <table class="detail-table-laporan-modal">
        <tr><td>Harga Jual</td><td>Rp${hargaJual.toLocaleString("id-ID")}</td></tr>
        <tr><td>Keuntungan</td><td>Rp${keuntungan.toLocaleString("id-ID")}</td></tr>
    </table>`;

        showModalCustom({
            title: "DETAIL TRANSAKSI",
            message,
            buttons: [
                { text: "Cetak", className: "modal-ok", onClick: () => console.log("Cetak:", parsed) },
                {
                    text: "Komplain",
                    className: "modal-cancel",
                    onClick: () => {
                        const pesan = `Mohon bantu cek transaksi berikut:
                        Tanggal : ${parsed.waktu}
                        Kode Produk : ${parsed.kode}
                        Tujuan : ${parsed.tujuan}
                        Serial Number : ${parsed.sn}
                        Status : ${parsed.status}`;

                        const nomorWA = "6283100100190";
                        const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
                        window.open(url, "_blank");
                    }
                },
                { text: "Set Harga Jual", className: "modal-ok", onClick: () => console.log("Set Harga Jual:", parsed) },
            ]
        });

    });

}
