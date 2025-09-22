//file getDataAkun.js
export function getDataAkun(msg) {
    const elems = msg.getElementsByTagName("body");

    if (elems.length > 0) {
        const body = elems[0].textContent;
        console.log("[DEBUG] body:", body);

        if (!body.includes("Yth.")) {
            return true;
        }

        // Ambil nama agen dan kode
        const agenMatch = body.match(/Yth\.\s+([^-]+)-\s*([A-Z0-9]+)/);
        const agen = agenMatch ? agenMatch[1].trim() : "tidak diketahui";
        localStorage.setItem("nama_agen", agen);
        const kodeAgen = agenMatch ? agenMatch[2].trim() : "tidak diketahui";

        // Ambil field lain
        const saldoMatch = body.match(/Saldo\s(-?[\d.]+)/);
        const prosesMatch = body.match(/Proses\s([\d.]+)/);
        const trxMatch = body.match(/Trx\s([\d.]+)/i);
        const bonusMatch = body.match(/Bonus\s([\d.]+)/);
        const poinMatch = body.match(/Poin\s([\d.]+)/i);
        const pemakaianMatch = body.match(/Pemakaian\s([\d.]+)/i);

        const saldo = saldoMatch ? saldoMatch[1] : "-";
        const proses = prosesMatch ? prosesMatch[1] : "-";
        const trx = trxMatch ? trxMatch[1] : "-";
        const bonus = bonusMatch ? bonusMatch[1] : "-";
        const poin = poinMatch ? poinMatch[1] : "-";
        const pemakaian = pemakaianMatch ? pemakaianMatch[1] : "-";

        // 🔹 Ambil tipe akun dari "Grup X" (bisa huruf atau angka)
        const grupMatch = body.match(/Grup\s+([A-Z0-9]+)/i);
        if (grupMatch) {
            const tipeAkun = grupMatch[1].toUpperCase();
            localStorage.setItem("tipe_akun", tipeAkun);
            console.log("[DEBUG] tipe_akun tersimpan:", tipeAkun);
        }


        // Tampilkan ke halaman
        document.getElementById("saldoDisplay").innerHTML = `
            <header style="
                margin-bottom:0.5rem;
                display:grid; 
                grid-template-columns: 1fr 1fr; 
                text-align:center;
                gap:0.5rem;
            ">
                <div>👤 <strong>${agen}</strong></div>
                <div>🆔 <strong>${kodeAgen}</strong></div>
            </header>
            <div style="
                display:grid; 
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                gap:0.5rem;
            ">
                <div>💰 <strong>Saldo:</strong> ${saldo}</div>
                <div>⚙️ <strong>Proses:</strong> ${proses}</div>
                <div>📊 <strong>Jml TRX:</strong> ${trx}</div>
                <div>🎁 <strong>Bonus:</strong> ${bonus}</div>
                <div>⭐ <strong>Poin:</strong> ${poin}</div>
                <div>📅 <strong>Terpakai:</strong> ${pemakaian}</div>
            </div>
        `;
    }
    return true;
}
