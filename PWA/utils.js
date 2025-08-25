let toastTimeout = null; // global untuk mengontrol hide toast

// fungsi buat tombol reusable
export function createButton(label, onClick) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.margin = "0.25rem";
    btn.addEventListener("click", onClick);
    return btn;
}

export function showToast(message, type = "error") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    let icon = "⚠️";
    toast.classList.remove("success", "error");

    if (type === "success") {
        icon = "✅";
        toast.classList.add("success");
    } else {
        toast.classList.add("error");
    }

    // icon di atas, message di bawah
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;
    toast.classList.add("show");

    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        toastTimeout = null;
    }, 3000);
}