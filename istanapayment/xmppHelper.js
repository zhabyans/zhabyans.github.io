// xmppHelper.js
import { connection } from "./xmpp.js";

/**
 * Kirim pesan chat ke server
 * @param {string} isiPesan - isi pesan
 * @param {string} to - tujuan (default user1)
 */
export function kirimPesan(isiPesan, to = "user1@istanapay.com") {
    if (!connection) {
        console.warn("XMPP connection belum tersedia.");
        return;
    }
    const message = $msg({ to: to, type: "chat" }).c("body").t(isiPesan);
    connection.send(message);
    console.log(`Pesan terkirim ke ${to}: ${isiPesan}`);
}

/**
 * Buat handler global untuk menerima pesan masuk
 * @param {Function} callback - fungsi untuk memproses body pesan
 */
export function onMessage(callback) {
    return function(msg) {
        const body = msg.getElementsByTagName("body")[0];
        if (body) {
            const responseText = Strophe.getText(body).trim();
            // console.log("Pesan masuk:", responseText);

            if (callback && typeof callback === "function") {
                callback(responseText, msg);
            }
        }
        return true; // supaya handler tetap aktif
    };
}
