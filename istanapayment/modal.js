// file modal.js
export function showModalCustom({
    title = "",
    message = "",
    buttons = []
}) {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalHeader = document.getElementById("modalHeader");
    const modalMessage = document.getElementById("modalMessage");
    const modalButtons = document.getElementById("modalButtons");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    modalHeader.textContent = title;
    modalMessage.innerHTML = message;
    modalOverlay.style.display = "flex";

    // kosongkan tombol lama
    modalButtons.innerHTML = "";

    // render tombol baru
    buttons.forEach(btn => {
        const buttonEl = document.createElement("button");
        buttonEl.textContent = btn.text;
        buttonEl.className = btn.className || "modal-ok";
        buttonEl.onclick = () => {
            modalOverlay.style.display = "none";
            if (btn.onClick) btn.onClick();
        };
        modalButtons.appendChild(buttonEl);
    });

    // event close (klik silang)
    modalCloseBtn.onclick = () => {
        modalOverlay.style.display = "none";
    };
}


// === wrapper lama agar tetap kompatibel ===
export function showModalConfirm(judul, message, onConfirm, onCancel) {
    showModalCustom({
        title: judul,
        message,
        buttons: [
            {
                text: "OK",
                className: "modal-ok",
                onClick: onConfirm
            },
            {
                text: "Cancel",
                className: "modal-cancel",
                onClick: onCancel
            }
        ]
    });
}
