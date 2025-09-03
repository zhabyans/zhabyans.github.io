// file: navigasi.js

export function navigasi() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-item");
  const header = document.querySelector("header");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // reset semua active
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.id === "laporanTransaksiBtn") {
        document.getElementById("laporanTransaksiDisplay").style.display = "block";
        document.getElementById("homeDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "none";
        header.style.display = "none"; // 🚀 sembunyikan header
      } else if (btn.id === "navBeranda") {
        document.getElementById("homeDisplay").style.display = "block";
        document.getElementById("laporanTransaksiDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "block";
        header.style.display = "block"; // tampilkan header lagi
      } else if (btn.id === "navAkun") {
        document.getElementById("laporanTransaksiDisplay").style.display = "none";
        document.getElementById("homeDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "none";
        header.style.display = "none"; // 🚀 sembunyikan header
      }
    });
  });
}
