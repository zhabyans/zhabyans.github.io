// file printStruk.js
import { hargaJualMap } from "./hargaJualMap.js";

export async function printStruk(parsed, tanggal) {
    try {
        let jenisProduk = "PRODUK DIGITAL";

        if (/^pln/i.test(parsed.kode)) {
            jenisProduk = "TAGIHAN LISTRIK PASCABAYAR";
        } else if (/^p/i.test(parsed.kode)) {
            jenisProduk = "TOKEN LISTRIK";
        } else if (/^td/i.test(parsed.kode)) {
            jenisProduk = "PAKET DATA";
        } else if (/^tr/i.test(parsed.kode)) {
            jenisProduk = "PULSA TRI";
        } else if (/^i/i.test(parsed.kode)) {
            jenisProduk = "PULSA INDOSAT";
        } else if (/^s/i.test(parsed.kode)) {
            jenisProduk = "PULSA SMARTFREN";
        } else if (/^x/i.test(parsed.kode)) {
            jenisProduk = "PULSA XL";
        } else if (/^a/i.test(parsed.kode)) {
            jenisProduk = "PULSA AXIS";
        } else if (/^t(?!d)/i.test(parsed.kode)) {
            jenisProduk = "PULSA TELKOMSEL";
        }

        // harga jual dari mapping, fallback ke harga modal
        const harga = hargaJualMap[parsed.kode.toLowerCase()]
            ?? (parseInt(parsed.harga?.replace(/\./g, ""), 10) || 0);

        // Admin hanya untuk PLN Pascabayar
        const admin = /^pln/i.test(parsed.kode) ? 3000 : 0;
        const total = harga + admin;

        const namaAgen = localStorage.getItem("nama_agen") || "";

        // 🔹 Template struk baru
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = `
        <div class="struk" style="position: relative; overflow: hidden; font-family: monospace; font-weight:bold; font-size: 18px; width: 350px; color: #000000; background: #fff;">
            
            <!-- Watermark -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                opacity: 0.08;
                font-size: 14px;
                color: #000;
                justify-content: center;
                align-content: center;
                pointer-events: none;
                z-index: 0;
            ">
                ${Array(100).fill(`<div style="margin:5px; transform: rotate(-30deg); white-space:nowrap;">${namaAgen}</div>`).join("")}
            </div>

            <!-- Konten utama -->
            <div style="position: relative; z-index: 1;">
                <div style="text-align:center; font-size: 26px">${namaAgen}</div>
                <div>${tanggal} ${parsed.waktu}</div>
                <div style="text-align:center; font-size: 22px">-- STRUK BUKTI PEMBELIAN --</div>
                <div style="text-align:center; font-size: 22px">${jenisProduk}</div>
                <hr style="border:2px dashed black; margin:5px 0;">
                <div>NOMOR : ${parsed.tujuan}</div>
                <div>KODE : ${parsed.kode}</div>
                <div>SN : ${parsed.sn}</div>
                <div style="text-align:center; margin-top:5px; margin-bottom:5px;">------- RINCIAN PEMBAYARAN -------</div>
                <div>HARGA : Rp${harga.toLocaleString("id-ID")}</div>
                <div>ADMIN : Rp${admin.toLocaleString("id-ID")}</div>
                <div style="font-size: 18px">TOTAL HARGA : Rp${total.toLocaleString("id-ID")}</div>
                <hr style="border:2px dashed black; margin:5px 0;">
                <div style="text-align:center; font-size: 22px">SIMPANLAH STRUK INI</div>
                <div style="text-align:center; font-size: 22px">SEBAGAI BUKTI PEMBELIAN ANDA</div>
                <div style="text-align:center; font-size: 22px;">TERIMA KASIH</div>
            </div>
        </div>
        `;
        document.body.appendChild(tempDiv);

        // 🔹 Generate gambar struk
        const canvas = await html2canvas(tempDiv.querySelector(".struk"), { scale: 2, backgroundColor: "#ffffff" });
        document.body.removeChild(tempDiv);

        const dataUrl = canvas.toDataURL("image/jpeg");
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "struk-transaksi.jpeg", { type: "image/jpeg" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: "Struk Transaksi",
                text: "Berikut struk transaksi Anda",
                files: [file],
            });
        } else if (navigator.share) {
            await navigator.share({
                title: "Struk Transaksi",
                text: `STRUK BUKTI PEMBELIAN
Jenis Produk : ${jenisProduk}
TGL: ${tanggal} ${parsed.waktu}
NOMOR : ${parsed.tujuan}
SERIAL NUMBER : ${parsed.sn}
HARGA : Rp${harga.toLocaleString("id-ID")}
ADMIN : Rp${admin.toLocaleString("id-ID")}
TOTAL : Rp${total.toLocaleString("id-ID")}
SIMPANLAH STRUK INI SEBAGAI BUKTI PEMBELIAN ANDA
TERIMA KASIH`,
            });
        } else {
            alert("❌ Web Share API tidak didukung di browser ini.");
        }
    } catch (err) {
        console.error("Gagal membagikan:", err);
        alert("Gagal membagikan struk.");
    }
}
