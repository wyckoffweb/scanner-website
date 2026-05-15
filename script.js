const mainTabs =
    document.querySelectorAll(".main-tab");

const subCategories =
    document.getElementById("subCategories");

const chartGrid =
    document.getElementById("chartGrid");

const learnersSection =
    document.getElementById("learnersSection");

const modal =
    document.getElementById("imageModal");

const modalImage =
    document.getElementById("modalImage");

const closeModal =
    document.getElementById("closeModal");

const lastUpdated =
    document.getElementById("lastUpdated");


let scannersData = {};

let currentImages = [];

let currentIndex = 0;

let touchStartX = 0;

let touchEndX = 0;


// ============================================
// LOAD SCANNERS
// ============================================

async function loadScanners() {

    try {

        const response =
            await fetch(
                "data/scanners.json"
            );

        scannersData =
            await response.json();

        renderCategory("swing");

        updateTimestamp();

    } catch (err) {

        console.error(err);

        chartGrid.innerHTML = `
            <p>
                Failed to load scanners.json
            </p>
        `;
    }
}


// ============================================
// TIMESTAMP
// ============================================

function updateTimestamp() {

    const now =
        new Date();

    lastUpdated.textContent =
        `Last Updated: ${now.toLocaleString()}`;
}


// ============================================
// MAIN CATEGORY SWITCH
// ============================================

mainTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            mainTabs.forEach(
                t => t.classList.remove("active")
            );

            tab.classList.add("active");

            renderCategory(
                tab.dataset.category
            );
        }
    );
});


// ============================================
// RENDER CATEGORY
// ============================================

function renderCategory(category) {

    chartGrid.innerHTML = "";

    subCategories.innerHTML = "";

    if (category === "learn") {

        learnersSection.classList.remove(
            "hidden"
        );

        return;
    }

    learnersSection.classList.add(
        "hidden"
    );

    const scanners =
        scannersData[category] || [];

    scanners.forEach(scanner => {

        const btn =
            document.createElement("button");

        btn.className =
            "sub-tile";

        if (category === "wyckoff") {

            btn.classList.add(
                "wyckoff"
            );
        }

        btn.innerHTML = `
            ${scanner.name}
            (${scanner.count})
        `;

        btn.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".sub-tile")
                    .forEach(
                        b => b.classList.remove("active")
                    );

                btn.classList.add(
                    "active"
                );

                loadCharts(scanner);
            }
        );

        subCategories.appendChild(btn);
    });

    // ========================================
    // SMART DEFAULTS
    // ========================================

    setTimeout(() => {

        let defaultTile = null;

        if (category === "swing") {

            defaultTile =
                [...document.querySelectorAll(".sub-tile")]
                .find(
                    b => b.innerText
                        .toLowerCase()
                        .includes("confluence")
                );
        }

        if (category === "wyckoff") {

            defaultTile =
                [...document.querySelectorAll(".sub-tile")]
                .find(
                    b => b.innerText
                        .toLowerCase()
                        .includes("ranking")
                );
        }

        if (!defaultTile) {

            defaultTile =
                document.querySelector(
                    ".sub-tile"
                );
        }

        defaultTile?.click();

    }, 100);
}


// ============================================
// LOAD CHARTS
// ============================================

async function loadCharts(scanner) {

    chartGrid.innerHTML = "";

    currentImages = [];

    try {

        const response =
            await fetch(
                scanner.path
            );

        const html =
            await response.text();

        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                html,
                "text/html"
            );

        const links =
            [
                ...doc.querySelectorAll("a")
            ];

        const pngs =
            links
                .map(
                    a => a.getAttribute("href")
                )
                .filter(
                    href =>
                        href &&
                        href.endsWith(".png")
                );

        if (pngs.length === 0) {

            chartGrid.innerHTML = `
                <p>
                    No charts available.
                </p>
            `;

            return;
        }

        currentImages =
            pngs.map(
                file =>
                    `${scanner.path}/${file}`
            );

        pngs.forEach(
            (file, index) => {

                const imgPath =
                    `${scanner.path}/${file}`;

                const symbol =
                    file
                        .replace(".png", "")
                        .replace(".NS", "");

                const tradingviewUrl =
                    `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;

                const card =
                    document.createElement("div");

                card.className =
                    "chart-card";

                card.innerHTML = `

                    <div class="chart-image-wrapper">

                        <img
                            src="${imgPath}"
                            loading="lazy"
                            alt="${file}"
                        >

                        <a
                            class="tv-link"
                            href="${tradingviewUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in TradingView"
                        >
                            <img
                                src="icons/tradingview.png"
                                alt="TradingView"
                            >
                        </a>

                    </div>

                    <div class="chart-info">

                        <h3>
                            ${symbol}
                        </h3>

                        <p>
                            ${scanner.name}
                        </p>

                    </div>
                `;

                card.addEventListener(
                    "click",
                    () => {

                        currentIndex =
                            index;

                        openModal();
                    }
                );

                chartGrid.appendChild(card);
            }
        );

    } catch (err) {

        console.error(err);

        chartGrid.innerHTML = `
            <p>
                Failed to load charts.
            </p>
        `;
    }
}


// ============================================
// MODAL
// ============================================

function openModal() {

    modal.classList.remove(
        "hidden"
    );

    modalImage.src =
        currentImages[currentIndex];

    renderNavButtons();

    updateNavVisibility();
}


function closeModalFn() {

    modal.classList.add(
        "hidden"
    );
}


function nextImage() {

    if (
        currentIndex <
        currentImages.length - 1
    ) {

        currentIndex++;

        openModal();

        updateNavVisibility();
    }
}


function prevImage() {

    if (currentIndex > 0) {

        currentIndex--;

        openModal();

        updateNavVisibility();
    }
}


// ============================================
// NAV BUTTONS
// ============================================

function renderNavButtons() {

    let prev =
        document.getElementById(
            "prevBtn"
        );

    let next =
        document.getElementById(
            "nextBtn"
        );

    if (!prev) {

        prev =
            document.createElement("button");

        prev.id = "prevBtn";

        prev.innerHTML = "❮";

        prev.className =
            "nav-btn prev-btn";

        prev.onclick =
            prevImage;

        modal.appendChild(prev);
    }

    if (!next) {

        next =
            document.createElement("button");

        next.id = "nextBtn";

        next.innerHTML = "❯";

        next.className =
            "nav-btn next-btn";

        next.onclick =
            nextImage;

        modal.appendChild(next);
    }
}


function updateNavVisibility() {

    const prev =
        document.getElementById(
            "prevBtn"
        );

    const next =
        document.getElementById(
            "nextBtn"
        );

    if (prev) {

        prev.style.display =
            currentIndex === 0
            ? "none"
            : "flex";
    }

    if (next) {

        next.style.display =
            currentIndex ===
            currentImages.length - 1
            ? "none"
            : "flex";
    }
}


// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener(
    "keydown",
    e => {

        if (
            modal.classList.contains(
                "hidden"
            )
        ) return;

        if (e.key === "ArrowRight") {

            nextImage();
        }

        if (e.key === "ArrowLeft") {

            prevImage();
        }

        if (e.key === "Escape") {

            closeModalFn();
        }
    }
);


// ============================================
// SWIPE SUPPORT
// ============================================

modal.addEventListener(
    "touchstart",
    e => {

        touchStartX =
            e.changedTouches[0].screenX;
    }
);

modal.addEventListener(
    "touchend",
    e => {

        touchEndX =
            e.changedTouches[0].screenX;

        handleSwipe();
    }
);


function handleSwipe() {

    const diff =
        touchStartX - touchEndX;

    if (diff > 50) {

        nextImage();
    }

    if (diff < -50) {

        prevImage();
    }
}


// ============================================
// CLOSE MODAL
// ============================================

closeModal.addEventListener(
    "click",
    closeModalFn
);

modal.addEventListener(
    "click",
    e => {

        if (e.target === modal) {

            closeModalFn();
        }
    }
);


// ============================================
// COMPACT SCROLL MODE
// ============================================

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 80) {

            document.body.classList.add(
                "scrolled"
            );

        } else {

            document.body.classList.remove(
                "scrolled"
            );
        }
    }
);


// ============================================
// INIT
// ============================================

loadScanners();