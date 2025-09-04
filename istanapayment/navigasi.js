// file: navigasi.js

export function navigasi() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-item");
  const akunDisplay = document.getElementById("akunDisplay");
  
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // reset semua active
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      if (btn.id === "navRiwayat") {
        console.log("ini navRiwayat");
        document.getElementById("laporanTransaksiDisplay").style.display = "block";
        document.getElementById("homeDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "none";
        akunDisplay.style.display = "none"; // tampilkan halaman akun
      } else if (btn.id === "navBeranda") {
        console.log("ini halaman navBeranda");
        document.getElementById("homeDisplay").style.display = "block";
        document.getElementById("laporanTransaksiDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "block";
        akunDisplay.style.display = "none"; // tampilkan halaman akun
      } else if (btn.id === "navAkun") {
        console.log("ini halaman navAkun");
        document.getElementById("laporanTransaksiDisplay").style.display = "none";
        document.getElementById("homeDisplay").style.display = "none";
        document.getElementById("saldoDisplay").style.display = "none";
        akunDisplay.style.display = "block"; // tampilkan halaman akun
      }
    });
  });
}
