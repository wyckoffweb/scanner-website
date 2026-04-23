let currentImages = [];
let currentIndex = 0;

function showTab(tab) {
    document.getElementById('swing').classList.add('hidden');
    document.getElementById('wyckoff').classList.add('hidden');
    document.getElementById(tab).classList.remove('hidden');
}

function loadImages(folder, elementId) {

    const container = document.getElementById(elementId);
    container.innerHTML = "Loading...";

    fetch(`data/${folder}/index.json`)
    .then(res => res.json())
    .then(files => {

        container.innerHTML = "";

        if (!files || files.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <h3>No setups today</h3>
                    <p>No stocks met this scanner’s conditions.</p>
                    <button class="back-btn" onclick="goHome()">← Back</button>
                </div>
            `;
            return;
        }

        currentImages = files.map(f => `data/${folder}/${f}`);

        files.forEach((file, index) => {
            const src = `data/${folder}/${file}`;

            const card = document.createElement("div");
            card.className = "card";

            const img = document.createElement("img");
            img.src = src;

            const btn = document.createElement("button");
            btn.innerText = "TradingView";
            btn.className = "tv-btn";

            btn.onclick = (e) => {
                e.stopPropagation();
                const symbol = file.replace(".png", "");
                window.open(`https://www.tradingview.com/chart/?symbol=NSE:${symbol}`);
            };

            card.appendChild(img);
            card.appendChild(btn);

            card.onclick = () => openModal(index);

            container.appendChild(card);
        });

    });
}

function openModal(index) {
    currentIndex = index;
    const modal = document.getElementById("modal");
    const img = document.getElementById("modal-img");

    img.src = currentImages[index];
    modal.style.display = "flex";

    enableSwipe(img);
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function enableSwipe(img) {
    let startX = 0;

    img.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    img.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].clientX;
        let diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    });
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

/* NAVIGATION */
function goToConfluence() {
    showTab('swing');
    loadImages('swing/confluence', 'swing-confluence');
    scrollTo('confluence-section');
}

function goToStrategy(name) {
    showTab('swing');
    loadImages(`swing/${name}`, 'strategy-results');
    scrollTo('strategy-section');
}

function goToWyckoff(type) {
    showTab('wyckoff');
    loadImages(`wyckoff/${type}/charts`, type);
    scrollTo(`${type}-section`);
}

function scrollTo(id) {
    setTimeout(() => {
        const el = document.getElementById(id);
        el.scrollIntoView({ behavior: "smooth" });
        el.classList.add("highlight");
        setTimeout(() => el.classList.remove("highlight"), 1000);
    }, 200);
}

function goHome() {
    showTab('swing');
    document.getElementById("tile-menu").scrollIntoView({ behavior: "smooth" });
}

/* LOAD DEFAULT */
window.onload = () => {
    loadImages("swing/confluence", "swing-confluence");
    loadImages("wyckoff/ranking/charts", "ranking");
};
