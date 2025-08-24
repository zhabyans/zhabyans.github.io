import { connection } from "./xmpp.js";
export function showMenuKotak() {
    const menus = [
        { name: "Pulsa", emoji: "📱" },
        { name: "Paket Data", emoji: "🌐" },
        { name: "Paket Nelpon", emoji: "📞" },
        { name: "Token Listrik", emoji: "⚡" },
        { name: "E-Wallet", emoji: "💳" },
        { name: "Listrik Pascabayar", emoji: "💡" },
        { name: "Bayar BPJS", emoji: "🏥" },
        { name: "Bayar IndiHome", emoji: "📺" },
        { name: "Voucher TV", emoji: "🎟️" }
    ];

    if (menuGrid) {
        menuGrid.innerHTML = ""; // kosongkan dulu

        menus.forEach(menu => {
            const div = document.createElement("div");
            div.className = "menu-item";
            div.style.display = "flex";
            div.style.flexDirection = "column";
            div.style.alignItems = "center";
            div.style.cursor = "pointer";

            // emoji
            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = menu.emoji;
            emojiSpan.style.fontSize = "2rem";
            emojiSpan.style.marginBottom = "0.5rem";

            // label
            const p = document.createElement("p");
            p.textContent = menu.name;
            p.style.margin = "0";

            div.appendChild(emojiSpan);
            div.appendChild(p);
            menuGrid.appendChild(div);

            // attach handler
            div.addEventListener("click", () => handleMenuClick(menu));
        });
    }
}

// TAMPILKAN TOAST
function showToast(message, type = "error") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    // Tentukan ikon & warna berdasarkan type
    let icon = "⚠️";
    toast.classList.remove("success", "error");

    if (type === "success") {
        icon = "✅";
        toast.classList.add("success");
    } else {
        toast.classList.add("error");
    }

    // Isi dengan ikon + pesan
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;

    // Tampilkan
    toast.classList.add("show");

    // Auto hide setelah 2.5 detik
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


//tampilan nama operator
const inputTujuan = document.getElementById("inputTujuan");
const operatorDisplay = document.getElementById("operatorDisplay");
const extraButtons = document.getElementById("extraButtons");
const menuGrid = document.getElementById("menuGrid");

// daftar prefix
const operatorPrefix = {
    "Telkomsel": ["0811", "0812", "0813", "0851", "0852", "0853", "0821", "0822", "0823", "0824"],
    "Indosat": ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
    "Axis": ["083", "0859"],
    "By.U": ["085155", "085156", "085157", "085158", "085154", "085159", "08512"],
    "Token Listrik": ["01", "04", "05", "06", "07", "09", "1", "2", "3", "4", "5", "6", "7", "8", "9", "001", "020", "03"],
    "Smartfren": ["088"],
    "Tri": ["089"],
    "XL": ["0817", "0818", "0819", "0859", "0878", "0877"]
};

// fungsi deteksi operator
function detectOperator(number) {
    let foundOperator = "";

    // urutkan prefix berdasarkan panjang (biar yang lebih spesifik dicek dulu, misalnya 085155 > 0851)
    const sortedOperators = Object.entries(operatorPrefix).sort((a, b) => {
        const maxA = Math.max(...a[1].map(p => p.length));
        const maxB = Math.max(...b[1].map(p => p.length));
        return maxB - maxA;
    });

    for (let [operator, prefixes] of sortedOperators) {
        for (let prefix of prefixes) {
            if (number.startsWith(prefix)) {
                return operator;
            }
        }
    }
    return foundOperator;
}

function clearExtraButtons() {
    extraButtons.innerHTML = "";
    extraButtons.style.display = "none";
}

function clearOperatorDisplay() {
    operatorDisplay.innerHTML = "";
    operatorDisplay.style.display = "none";
}

// ----------------------
// LISTENER INPUT
// ----------------------
inputTujuan.addEventListener("input", handleInputChange);

// ----------------------
// EVENT HANDLER: INPUT
// ----------------------
function handleInputChange() {
    const nomor = inputTujuan.value.trim();

    if (!nomor) {
        operatorDisplay.textContent = "";
        clearExtraButtons();
        return;
    }

    // gunakan fungsi detectOperator
    const operator = detectOperator(nomor) || "Unknown";

    operatorDisplay.textContent = operator;
    clearExtraButtons();
}


// ----------------------
// EVENT HANDLER: MENU
// ----------------------
function handleMenuClick(menu) {
    if (!inputTujuan.value.trim()) {
        showToast("Masukkan nomor tujuan terlebih dahulu", "error")
        inputTujuan.focus();
        return;
    }

    clearExtraButtons();

    if (menu.name === "Pulsa") {
        const operator = operatorDisplay.textContent;
        showPulsaOptions(operator);
    }
    else if (menu.name === "Paket Data") {
        const operator = operatorDisplay.textContent;
        showPaketDataOptions(operator);
    }
    else {
        alert("Klik menu: " + menu.name);
    }
}

// ----------------------
// khusus pulsa
// ----------------------
function showPulsaOptions(operator) {
    if (!operator || operator === "Unknown") {
        alert("Operator tidak dikenali untuk Pulsa");
        return;
    }

    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;

    // contoh: Telkomsel ada 2 tombol khusus
    if (operator === "Telkomsel") {
        extraButtons.appendChild(
            createButton("Reguler", () => kirimPesan("harga.t"))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => alert("Tambah Masa Aktif Telkomsel"))
        );
    } else {
        // default untuk operator lain
        extraButtons.appendChild(
            createButton("Reguler", () => alert("Pulsa Reguler " + operator))
        );
    }
}

// ----------------------
// khusus paket data
// ----------------------
function showPaketDataOptions(operator) {
    if (!operator || operator === "Unknown") {
        alert("Operator tidak dikenali untuk Paket Data");
        return;
    }

    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;

    if (operator === "Telkomsel") {
        extraButtons.appendChild(
            createButton("Internet OMG", () => alert("Paket Internet OMG Telkomsel"))
        );
        extraButtons.appendChild(
            createButton("Combo Sakti", () => alert("Paket Combo Sakti Telkomsel"))
        );
    }
    else if (operator === "Indosat") {
        extraButtons.appendChild(
            createButton("Freedom Internet", () => alert("Freedom Internet Indosat"))
        );
        extraButtons.appendChild(
            createButton("Freedom Combo", () => alert("Freedom Combo Indosat"))
        );
    }
    else if (operator === "XL") {
        extraButtons.appendChild(
            createButton("Xtra Combo", () => alert("Paket Xtra Combo XL"))
        );
        extraButtons.appendChild(
            createButton("HotRod", () => alert("Paket HotRod XL"))
        );
    }
    else {
        // default tombol paket data
        extraButtons.appendChild(
            createButton("Internet Reguler", () => alert("Paket Data " + operator))
        );
    }
}

export function kirimPesan(isiPesan) {
    const to = "user1@pulsa.dpdns.org";
    const body = isiPesan;
    const message = $msg({ to: to, type: "chat" }).c("body").t(body);
    connection.send(message);
    console.log(`Pesan terkirim ke ${to}: ${body}`);
    connection.addHandler(onMessage, null, "message", "chat", null, null);
}

// fungsi bikin tombol
function createButton(label, onClick) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.margin = "0.25rem";
    btn.addEventListener("click", onClick);
    return btn;
}

// -------------------------------------------
// MENAMPILKAN LIST HARGA SEBAGAI LIST BARIS (pico.css style)
// -------------------------------------------
function tampilkanHargaKeTombol(responseText) {
    clearExtraButtons(); // bersihkan dulu
    extraButtons.style.display = "block";

    // set class untuk list vertikal
    extraButtons.className = "harga-list";

    // pecah per baris
    const lines = responseText.split("\n").map(l => l.trim()).filter(l => l);

    lines.forEach(line => {
        const parts = line.split("=");
        if (parts.length >= 3) {
            const kode = parts[0].trim();
            const deskripsi = parts[1].trim();
            const harga = parts[2].replace(";", "").trim();

            // bikin item list
            const div = document.createElement("div");
            div.className = "menu-item harga-item"; // pakai style pico
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.alignItems = "center";
            div.style.padding = "0.5rem 1rem";

            // isi konten: kode | deskripsi | harga
            div.innerHTML = `
                <span style="font-weight:bold; color:var(--pico-primary); min-width:50px;">${kode}</span>
                <span style="flex:1; margin-left:1rem;">${deskripsi}</span>
                <span style="font-weight:bold; color:var(--pico-success); min-width:60px; text-align:right;">${harga}</span>
            `;

            // klik beli dengan konfirmasi
            div.addEventListener("click", () => {
                const nomor = inputTujuan.value;
                const pesanKonfirmasi = `Apakah Anda Yakin Membeli ${deskripsi} seharga ${harga} ke nomor ${nomor}?`;

                if (confirm(pesanKonfirmasi)) {
                    kirimPesan(`${kode}.${nomor}`);
                    kirimPesan(`S`);
                    showToast("Pembelian sedang diproses, Silakan cek pada menu Laporan Transaksi", "success");
                } else {
                    showToast("Pembelian dibatalkan", "error");
                }
            });
            extraButtons.appendChild(div);
        }
    });
}

// contoh: ketika menerima pesan masuk
function onMessage(msg) {
    const body = msg.getElementsByTagName("body")[0];
    if (body) {
        const responseText = Strophe.getText(body);
        console.log("Jawaban server ke menu kotak:", responseText);

        // tampilkan jadi tombol
        tampilkanHargaKeTombol(responseText);
    }
    return true; // biar listener tetap jalan
}