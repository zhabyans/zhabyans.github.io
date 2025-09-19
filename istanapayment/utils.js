let toastTimeout = null; // global untuk mengontrol hide toast

// fungsi buat tombol reusable
export function createButton(label, onClick) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.style.margin = "0.25rem";
  btn.addEventListener("click", onClick);
  return btn;
}

export function showToast(message, type = "error", durasi = 3000) {
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
  }, durasi);
}

// Utility untuk normalisasi angka Rupiah
export function normalizeRupiah(str) {
  if (!str) return 0;
  return parseInt(str.replace(/[^0-9]/g, ""), 10) || 0;
}

// Fungsi normalisasi nomor tujuan
export function normalizeInput(value) {
  if (!value) return "";

  // Hapus semua karakter kecuali angka
  let val = value.replace(/\D/g, "");

  // Normalisasi ke format 08xxxx
  if (val.startsWith("62")) {
    val = "0" + val.substring(2);
  } else if (val.startsWith("8")) {
    // jika user ketik 812..., otomatis jadi 0812...
    val = "0" + val;
  }
  // kalau sudah mulai dengan "0", biarkan

  return val;
}


// Fungsi untuk toggle show/hide password
export function setupTogglePassword(toggleBtnEl, passInputEl) {
  toggleBtnEl.addEventListener("click", () => {
    if (passInputEl.type === "password") {
      passInputEl.type = "text";
      toggleBtnEl.textContent = "🙈"; // ganti ikon saat terlihat
    } else {
      passInputEl.type = "password";
      toggleBtnEl.textContent = "👁";
    }
  });
}

// Cegah seleksi teks dan klik kanan
export function preventTextSelectionAndContextMenu() {
  document.addEventListener("selectstart", (e) => {
    e.preventDefault();
  });

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}

export function showLoadingModal() {
    document.getElementById("loadingModal").style.display = "flex";
    updateProgress(0);
}

export function hideLoadingModal() {
    document.getElementById("loadingModal").style.display = "none";
}

export function updateProgress(val) {
    const progress = document.getElementById("loginProgress");
    const text = document.getElementById("loginProgressText");
    if (progress && text) {
        progress.value = val;
        text.textContent = val + "%";
    }
}
