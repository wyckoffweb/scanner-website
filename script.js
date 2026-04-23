function loadLastUpdated() {
    fetch("data/last_updated.json?t=" + new Date().getTime())
    .then(res => res.json())
    .then(data => {
        document.getElementById("last-updated").innerText =
            "Last updated: " + data.updated;
    })
    .catch(() => {
        document.getElementById("last-updated").innerText =
            "Last updated: unavailable";
    });
}

window.onload = () => {
    loadLastUpdated();
};

window.onscroll = () => {
    const b = document.getElementById("scrollTopBtn");
    b.style.display = document.documentElement.scrollTop > 300 ? "block" : "none";
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
