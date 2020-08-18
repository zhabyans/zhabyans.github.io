function myFunction() {
    var x = document.getElementById("biodata");
    var y = document.getElementById("button-biodata")
    if (x.style.display === "block") {
        x.style.display = "none";
        y.innerHTML = "Tampilkan Biodata"
    } else {
        x.style.display = "block";
        y.innerHTML = "Sembunyikan Biodata"
    }
}