import { createButton } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";
const inputTujuan = document.getElementById("inputTujuan");

export function showTokenOptions(extraButtons, operatorDisplay, operator) {
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;
    extraButtons.appendChild(
        createButton("Cek Nama Pemilik", () => kirimPesan("cektoken." + inputTujuan.value))
    );
    extraButtons.appendChild(
        createButton("Beli Token Listrik", () => kirimPesan("harga.p"))
    );
}
