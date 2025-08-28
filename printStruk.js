// file: printStruk.js
export async function printStruk(parsed, tanggal) {
    try {
        // 🔹 Tentukan jenis struk berdasarkan prefix kode produk
        let jenisProduk = "PRODUK DIGITAL";
        if (/^p/i.test(parsed.kode)) {
            jenisProduk = "TOKEN LISTRIK";
        } else if (/^t(?!d)/i.test(parsed.kode)) {
            jenisProduk = "PULSA TELKOMSEL";
        } else if (/^td/i.test(parsed.kode)) {
            jenisProduk = "PAKET DATA";
        }

        // 🔹 Hitung total harga
        const harga = parseInt(parsed.harga.replace(/\./g, ""), 10) || 0;
        const admin = 3000;
        const total = harga + admin;

        // 🔹 Template struk baru
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = `
        <div class="struk" style="font-family: monospace; font-size: 12px; padding: 10px; width: 280px; color: #000000;">
            <div style="text-align:center; color:black; font-weight:bold; font-size: 18px">${localStorage.getItem("nama_agen")}</div>
            <div style="text-align:left; color:black;">${tanggal} ${parsed.waktu}</div>
            <div style="text-align:center; font-weight:bold; color:black;">-- STRUK BUKTI PEMBELIAN --</div>
            <div style="text-align:center; font-weight:bold; color:black;">${jenisProduk}</div>
            <hr style="border:1px dashed black; margin:5px 0;">
            <div style="color:black;">ID PEL : ${parsed.tujuan}</div>
            <div style="color:black;">KODE : ${parsed.kode}</div>
            <div style="color:black;">SN : ${parsed.sn}</div>
            <div style="font-weight:bold; text-align:center; margin-top:5px; margin-bottom:5px; color:black;">-------- RINCIAN PEMBAYARAN --------</div>
            <div style="color:black;">HARGA : Rp${harga.toLocaleString("id-ID")}</div>
            <div style="color:black;">ADMIN : Rp${admin.toLocaleString("id-ID")}</div>
            <div style="font-weight:bold; color:black;">TOTAL HARGA : Rp${total.toLocaleString("id-ID")}</div>
            <hr style="border:1px dashed black; margin:5px 0;">
            <div style="text-align:center; color:black;">SIMPANLAH STRUK INI</div>
            <div style="text-align:center; color:black;">SEBAGAI BUKTI PEMBELIAN ANDA</div>
            <div style="text-align:center; color:black;">TERIMA KASIH</div>
        </div>
        `;
        document.body.appendChild(tempDiv);

        // 🔹 Generate gambar struk
        const canvas = await html2canvas(tempDiv.querySelector(".struk"), { scale: 2, backgroundColor: "#ffffff" });
        document.body.removeChild(tempDiv);

        const dataUrl = canvas.toDataURL("image/jpeg");
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "struk-transaksi.jpeg", { type: "image/jpeg" });

        // 🔹 Share ke perangkat
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
ID PEL : ${parsed.tujuan}
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
