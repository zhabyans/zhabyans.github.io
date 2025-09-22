import { showToast } from "./utils.js";

// file: printThermal.js
let printCharacteristic = null;

async function connectPrinter() {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }]
  });
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");
  printCharacteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");
}

async function sendToPrinter(text) {
  if (!printCharacteristic) {
    await connectPrinter();
  }
  if (printCharacteristic) {
    const encoder = new TextEncoder("utf-8");
    const data = encoder.encode(text + "\n\r\n\r\n\r\n\r"); // margin bawah
    await printCharacteristic.writeValue(data);
  }
}

// 🔹 Export fungsi print struk thermal
export async function printThermalStruk(parsed, tanggal, hargaJual) {
  // copy logika dari shareStruk.js, tapi buat versi text sederhana untuk thermal
  let jenisProduk = "PRODUK DIGITAL";
  if (/^pln/i.test(parsed.kode)) jenisProduk = "TAGIHAN LISTRIK PASCABAYAR";
  else if (/^p/i.test(parsed.kode)) jenisProduk = "TOKEN LISTRIK";
  else if (/^td/i.test(parsed.kode)) jenisProduk = "PAKET DATA";
  else if (/^tr/i.test(parsed.kode)) jenisProduk = "PULSA TRI";
  else if (/^i/i.test(parsed.kode)) jenisProduk = "PULSA INDOSAT";
  else if (/^s/i.test(parsed.kode)) jenisProduk = "PULSA TFREN";
  else if (/^x/i.test(parsed.kode)) jenisProduk = "PULSA XL";
  else if (/^a/i.test(parsed.kode)) jenisProduk = "PULSA AXIS";
  else if (/^t(?!d)/i.test(parsed.kode)) jenisProduk = "PULSA TELKOMSEL";

  const admin = /^pln/i.test(parsed.kode) ? 3000 : 0;
  const total = hargaJual + admin;
  const namaAgen = localStorage.getItem("nama_agen") || "";

  // 🔹 Format struk khusus thermal printer (plain text)
  const strukText = `
${namaAgen}
${tanggal} ${parsed.waktu}
-- STRUK BUKTI PEMBELIAN --
${jenisProduk}
------------------------------
NOMOR : ${parsed.tujuan}
KODE  : ${parsed.kode}
SN    : ${parsed.sn}
------------------------------
HARGA : Rp${hargaJual.toLocaleString("id-ID")}
ADMIN : Rp${admin.toLocaleString("id-ID")}
TOTAL : Rp${total.toLocaleString("id-ID")}
------------------------------
SIMPANLAH STRUK INI
SEBAGAI BUKTI PEMBELIAN ANDA
TERIMA KASIH
`;

  try {
    await sendToPrinter(strukText);
    showToast("✅ Struk berhasil dikirim ke printer thermal", "success");
  } catch (err) {
    showToast("❌ Gagal print: " + err, "error");
  }
}
