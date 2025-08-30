import { createButton } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";

export function menuEwallet(extraButtons, operatorDisplay, operator) {
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;
    extraButtons.appendChild(
        createButton("Dana", () => kirimPesan("harga.d"))
    );
    extraButtons.appendChild(
        createButton("Shopee Pay", () => kirimPesan("harga.sp"))
    );
    extraButtons.appendChild(
        createButton("Gopay", () => kirimPesan("harga.gp"))
    );
    extraButtons.appendChild(
        createButton("Ovo", () => kirimPesan("harga.o"))
    );
    extraButtons.appendChild(
        createButton("Grab", () => kirimPesan("harga.gr"))
    );
    extraButtons.appendChild(
        createButton("LinkAja", () => kirimPesan("harga.la"))
    );
    extraButtons.appendChild(
        createButton("Mandiri E-Money", () => kirimPesan("harga.em"))
    );
    extraButtons.appendChild(
        createButton("BNI TapCash", () => kirimPesan("harga.bnitap"))
    );
    extraButtons.appendChild(
        createButton("BRI Bizzi", () => kirimPesan("harga.brizzi"))
    );
    extraButtons.appendChild(
        createButton("Maxim", () => kirimPesan("harga.max"))
    );
}
