//file register.js
import { showToast, setupTogglePassword } from "./utils.js";

export function setupRegister(domain) {

    const formLogin = document.getElementById("formLogin");
    const formRegister = document.getElementById("formRegister");
    const btnShowRegister = document.getElementById("showRegister");
    const btnBack = document.getElementById("backToLogin");

    const regUser = document.getElementById("regUser");
    const regPass = document.getElementById("regPass");
    const regPass2 = document.getElementById("regPass2");
    const regWarning = document.getElementById("regWarning");
    const passWarning = document.getElementById("passWarning");

    // setup toggle password
    setupTogglePassword(document.getElementById("toggleRegPass"), regPass);
    setupTogglePassword(document.getElementById("toggleRegPass2"), regPass2);

    // 🔹 tampilkan form register
    btnShowRegister.addEventListener("click", () => {
        formLogin.style.display = "none";
        formRegister.style.display = "block";
    });

    // 🔹 kembali ke login
    btnBack.addEventListener("click", () => {
        formRegister.reset();
        regWarning.style.display = "none";
        passWarning.style.display = "none";
        formRegister.style.display = "none";
        formLogin.style.display = "block";
    });

    // 🔹 validasi username realtime
    regUser.addEventListener("input", () => {
        const value = regUser.value;

        if (!/^[A-Za-z0-9]*$/.test(value)) {
            regWarning.textContent = "Username hanya boleh huruf dan angka (tanpa spasi & simbol)!";
            regWarning.style.display = "block";
        } else {
            regWarning.style.display = "none";
        }
    });

    // 🔹 validasi password realtime
    function checkPasswordMatch() {
        if (regPass.value && regPass2.value && regPass.value !== regPass2.value) {
            passWarning.textContent = "Konfirmasi password tidak cocok!";
            passWarning.style.display = "block";
        } else {
            passWarning.style.display = "none";
        }
    }

    regPass.addEventListener("input", checkPasswordMatch);
    regPass2.addEventListener("input", checkPasswordMatch);

    // 🔹 submit register
    formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();

        // validasi username
        if (!/^[A-Za-z0-9]+$/.test(regUser.value)) {
            regWarning.textContent = "Username hanya boleh huruf dan angka (tanpa spasi & simbol)!";
            regWarning.style.display = "block";
            return;
        }

        // validasi password
        if (regPass.value !== regPass2.value) {
            passWarning.textContent = "Konfirmasi password tidak cocok!";
            passWarning.style.display = "block";
            return;
        }

        try {
            const res = await fetch("https://pulsa.dpdns.org:5443/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa("adminkantor@pulsa.dpdns.org:password123")
                },
                body: JSON.stringify({
                    user: regUser.value,
                    host: domain,
                    password: regPass.value
                })
            });

            let data;
            try {
                data = await res.json(); // coba parse JSON
            } catch {
                data = await res.text(); // fallback ke text
            }

            console.log("Register response:", data);

            if (res.ok && typeof data === "string" && data.includes("successfully registered")) {
                // ✅ sukses dari response text
                const username = regUser.value;

                showToast("Akun berhasil dibuat, silakan login!", "success");

                // kirim pesan WhatsApp otomatis
                const nomor = "6282316015252"; // 62 = kode negara Indonesia
                const pesan = `tambahakun ${username}@${domain}/`;
                window.open(`https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`, "_blank");

                formRegister.reset();
                formRegister.style.display = "none";
                formLogin.style.display = "block";
                document.getElementById("akune").value = username;
            }

            else if (data && data.status === "error" && data.message) {
                // ❌ error JSON (misalnya user sudah terdaftar)

                // cek kalau pesan mengandung "already registered"
                if (data.message.includes("already registered")) {
                    // ambil username dari input (lebih aman daripada parsing domain)
                    const username = regUser.value;
                    showToast(`Username ${username} sudah terdaftar, gunakan username lain`, "error", 5000);
                } else {
                    showToast(data.message, "error");
                }

                // fokus ke regUser dan kosongkan password
                regPass.value = "";
                regPass2.value = "";

            } else {
                // fallback error umum
                showToast("Gagal register, coba lagi!", "error");
            }

        } catch (err) {
            console.error(err);
            showToast("Terjadi kesalahan koneksi", "error");
        }
    });

}
