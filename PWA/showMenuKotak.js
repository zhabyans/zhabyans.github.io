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

    const menuGrid = document.getElementById("menuGrid");
    if (menuGrid) {
        menuGrid.innerHTML = ""; // kosongkan dulu

        menus.forEach(menu => {
            const div = document.createElement("div");
            div.className = "menu-item";
            div.style.display = "flex";
            div.style.flexDirection = "column";
            div.style.alignItems = "center";
            div.style.cursor = "pointer";

            // emoji menu
            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = menu.emoji;
            emojiSpan.style.fontSize = "2rem"; // ukuran emoji lebih besar
            emojiSpan.style.marginBottom = "0.5rem";

            // nama menu
            const p = document.createElement("p");
            p.textContent = menu.name;
            p.style.margin = "0";

            div.appendChild(emojiSpan);
            div.appendChild(p);
            menuGrid.appendChild(div);

            // Event klik menu
            div.addEventListener("click", () => {
                alert("Klik menu: " + menu.name);
            });
        });
    }
}