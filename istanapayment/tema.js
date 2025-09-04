// tema.js
export function setupTheme() {
    const toggleBtns = document.querySelectorAll(".toggleThemeBtn"); // ambil semua tombol
    const htmlTag = document.documentElement;
    const themeMeta = document.getElementById("theme-color");

    // cek preferensi dari localStorage
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        htmlTag.setAttribute("data-theme", savedTheme);
    } else {
        // kalau belum ada, ikuti preferensi perangkat
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            htmlTag.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            htmlTag.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }

    // fungsi untuk update UI tombol & status bar
    function updateUI() {
        let theme = htmlTag.getAttribute("data-theme");

        toggleBtns.forEach(btn => {
            const icon = btn.querySelector(".akun-icon") || btn; // cari <span class="akun-icon"> kalau ada
            if (theme === "dark") {
                icon.textContent = "☀️";
                themeMeta.setAttribute("content", "#121212"); // status bar dark
            } else {
                icon.textContent = "🌙";
                themeMeta.setAttribute("content", "#ffffff"); // status bar light
            }
        });
    }


    // pasang event listener di semua tombol
    toggleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            let currentTheme = htmlTag.getAttribute("data-theme");
            let newTheme = currentTheme === "dark" ? "light" : "dark";
            htmlTag.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateUI();
        });
    });

    // pertama kali jalan langsung update tampilan
    updateUI();
}
