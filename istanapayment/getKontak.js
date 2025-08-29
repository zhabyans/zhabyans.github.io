export function getKontak() {
    const inputTujuan = document.getElementById("inputTujuan");
    const contactBtn = document.getElementById("contactBtn");
    contactBtn.addEventListener("click", async () => {
        // nanti gunakan Contacts API jika tersedia
        if ("contacts" in navigator && "ContactsManager" in window) {
            try {
                const props = ["name", "tel"];
                const opts = { multiple: false };
                const contacts = await navigator.contacts.select(props, opts);
                if (contacts.length > 0) {
                    inputTujuan.value = contacts[0].tel[0];
                    inputTujuan.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
                }
            } catch (err) {
                console.error("Akses kontak gagal:", err);
            }
        } else {
            alert("Browser Anda tidak mendukung akses kontak.");
        }
    });
}