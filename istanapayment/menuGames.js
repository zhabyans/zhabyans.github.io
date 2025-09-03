import { createButton } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";

export function menuGames(extraButtons, operatorDisplay, operator) {
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;
    extraButtons.appendChild(
        createButton("Free Fire", () => kirimPesan("harga.ff"))
    );
    extraButtons.appendChild(
        createButton("Mobile Legends", () => kirimPesan("harga.ml"))
    );
    extraButtons.appendChild(
        createButton("PUBG Mobile", () => kirimPesan("harga.pm"))
    );
    extraButtons.appendChild(
        createButton("Point Blank", () => kirimPesan("harga.pb"))
    );
}
