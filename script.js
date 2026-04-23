let currentImages = [];
let currentIndex = 0;

function showTab(tab) {
    document.getElementById('swing').classList.add('hidden');
    document.getElementById('wyckoff').classList.add('hidden');
    document.getElementById(tab).classList.remove('hidden');
}

function loadCounts() {

    const strategies = [
        ["count-confluence", "swing/confluence"],
        ["count-breakout", "swing/breakout"],
        ["count-ema50_pullback", "swing/ema50_pullback"],
        ["count-ema20_trend", "swing/ema20_trend"],
        ["count-rsi_momentum", "swing/rsi_momentum"],
        ["count-bollinger", "swing/bollinger"],
        ["count-golden_cross", "swing/golden_cross"],
        ["count-ranking", "wyckoff/ranking/charts"]
    ];

    strategies.forEach(s => {
        fetch(`data/${s[1]}/index.json`)
        .then(r => r.json())
        .then(f => {
            document.getElementById(s[0]).innerText = `(${f.length})`;
        })
        .catch(() => {
            document.getElementById(s[0]).innerText = "(0)";
        });
    });
}

function loadImages(folder, elementId) {

    const container = document.getElementById(elementId);
    container.innerHTML = "Loading...";

    fetch(`data/${folder}/index.json`)
    .then(res => res.json())
    .then(files => {

        container.innerHTML = "";

        if (!files.length) {
            container.innerHTML = `
                <div class="no-data">
                    <h3>No setups today</h3>
                    <button class="back-btn" onclick="goHome()">← Back</button>
                </div>
            `;
            return;
        }

        currentImages = files.map(f => `data/${folder}/${f}`);

        files.forEach((f, i) => {

            const card = document.createElement("div");
            card.className = "card";

            const img = document.createElement("img");
            img.src = currentImages[i];

            const btn = document.createElement("button");
            btn.innerText = "TradingView";
            btn.className = "tv-btn";

            btn.onclick = (e) => {
                e.stopPropagation();
                const sym = f.replace(".png","");
                window.open(`https://www.tradingview.com/chart/?symbol=NSE:${sym}`);
            };

            card.appendChild(img);
            card.appendChild(btn);
            card.onclick = () => openModal(i);

            container.appendChild(card);
        });

    });
}

function openModal(i) {
    currentIndex = i;
    document.getElementById("modal-img").src = currentImages[i];
    document.getElementById("modal").style.display = "flex";

    document.onkeydown = e => {
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    };
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function nextImage() {
    if (currentIndex < currentImages.length - 1) {
        currentIndex++;
        document.getElementById("modal-img").src = currentImages[currentIndex];
    }
}

function prevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        document.getElementById("modal-img").src = currentImages[currentIndex];
    }
}

function goToConfluence() {
    showTab('swing');
    loadImages('swing/confluence','swing-confluence');
}

function goToStrategy(n) {
    showTab('swing');
    loadImages(`swing/${n}`,'strategy-results');
}

function goToWyckoff(n) {
    showTab('wyckoff');
    loadImages(`wyckoff/${n}/charts`, n);
}

function goHome() {
    document.getElementById("tile-menu").scrollIntoView({behavior:"smooth"});
}

window.onscroll = () => {
    const b = document.getElementById("scrollTopBtn");
    b.style.display = document.documentElement.scrollTop > 300 ? "block" : "none";
};

function scrollToTop() {
    window.scrollTo({top:0,behavior:"smooth"});
}

window.onload = () => {
    loadCounts();
    loadImages("swing/confluence","swing-confluence");
    loadImages("wyckoff/ranking/charts","ranking");
};
