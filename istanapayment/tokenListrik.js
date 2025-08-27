import { createButton } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";

export function showTokenOptions(extraButtons, operatorDisplay, operator) {
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;
    extraButtons.appendChild(
        createButton("Token Listrik", () => kirimPesan("harga.p"))
    );
}
