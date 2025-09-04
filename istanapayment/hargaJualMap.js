// file: hargaJualMap.js

// mapping khusus kode yang tidak ikut aturan nominal
const specialMap = {
    "xcf1": 24000,
    "td2": 32000,
    "xcf1a": 18000
};

// daftar prefix yang pakai aturan nominal
const prefixes = [
    "t", "i", "a", "x", "s", "tr", "b", "p", "d", "sp",
    "gp", "o", "gr", "la", "em", "bnitap", "brizzi", "max"
];

// fungsi untuk fallback perhitungan (modal + 1500 dibulatkan ke 500 atas)
function hitungHargaJualDefault(hargaModal) {
    const minimal = hargaModal + 1500;
    const kelipatan = 500;
    return Math.ceil(minimal / kelipatan) * kelipatan;
}

export function getHargaJual(kode, hargaModal) {
    if (!kode) return hitungHargaJualDefault(hargaModal);

    const lowerKode = kode.toLowerCase();

    // cek mapping khusus dulu
    if (specialMap[lowerKode]) {
        return specialMap[lowerKode];
    }

    // cek apakah awalan cocok dengan daftar prefix
    for (const prefix of prefixes) {
        if (lowerKode.startsWith(prefix)) {
            const nominalPart = lowerKode.slice(prefix.length);

            // jika ada nominal angka
            if (/^\d+$/.test(nominalPart)) {
                const nominal = parseInt(nominalPart, 10);
                return (nominal + 3) * 1000;
            }

            // jika tidak ada nominal angka → harga modal
            return hargaModal;
        }
    }

    // fallback terakhir → pakai aturan keuntungan minimal 1500 + pembulatan 500
    return hitungHargaJualDefault(hargaModal);
}
