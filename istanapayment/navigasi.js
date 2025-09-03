// file: navigasi.js

export function navigasi() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-item");
  const header = document.querySelector("header");
  const akunDisplay = document.getElementById("akunDisplay");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // reset semua active
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.id === "navRiwayat") {
        document.getElementById("laporanTransaksiDisplay").style.display = "block";
        document.getElementById("homeDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "none";
        header.style.display = "none"; // 🚀 sembunyikan header
        akunDisplay.style.display = "none"; // tampilkan halaman akun
      } else if (btn.id === "navBeranda") {
        document.getElementById("homeDisplay").style.display = "block";
        document.getElementById("laporanTransaksiDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "block";
        header.style.display = "block"; // tampilkan header lagi
        akunDisplay.style.display = "none"; // tampilkan halaman akun
      } else if (btn.id === "navAkun") {
        document.getElementById("laporanTransaksiDisplay").style.display = "none";
        document.getElementById("homeDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "none";
        header.style.display = "none"; // 🚀 sembunyikan header
        akunDisplay.style.display = "block"; // tampilkan halaman akun
      }
    });
  });
}
