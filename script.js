const chartGrid =
    document.getElementById(
        "chartGrid"
    );

const subCategories =
    document.getElementById(
        "subCategories"
    );

const learnersSection =
    document.getElementById(
        "learnersSection"
    );

const modal =
    document.getElementById(
        "imageModal"
    );

const modalImage =
    document.getElementById(
        "modalImage"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const lastUpdated =
    document.getElementById(
        "lastUpdated"
    );

const prevArrow =
    document.getElementById(
        "prevArrow"
    );

const nextArrow =
    document.getElementById(
        "nextArrow"
    );

let scannersData = {};

let currentCategory = "swing";

let currentScanner = null;

let currentImages = [];

let currentImageIndex = 0;


/* =========================================
   LOAD SCANNERS
========================================= */

async function loadScanners() {

    try {

        const response =
            await fetch(
                "data/scanners.json"
            );

        scannersData =
            await response.json();

        setupMainTabs();

        showCategory(
            "swing"
        );

        loadLastUpdated();
    }

    catch (error) {

        console.error(
            "Failed to load scanners:",
            error
        );
    }
}


/* =========================================
   MAIN TABS
========================================= */

function setupMainTabs() {

    const tabs =
        document.querySelectorAll(
            ".main-tab"
        );

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const category =
                    tab.dataset.category;

                showCategory(
                    category
                );
            }
        );
    });
}


/* =========================================
   SHOW CATEGORY
========================================= */

function showCategory(category) {

    currentCategory = category;

    document
        .querySelectorAll(".main-tab")
        .forEach(tab => {

            tab.classList.remove(
                "active"
            );
        });

    const activeTab =
        document.querySelector(
            `[data-category="${category}"]`
        );

    if (activeTab) {

        activeTab.classList.add(
            "active"
        );
    }


    /* =====================================
       LEARNERS MODE
    ===================================== */

    if (category === "learners") {

        learnersSection.classList.remove(
            "hidden"
        );

        chartGrid.classList.add(
            "hidden"
        );

        subCategories.classList.add(
            "hidden"
        );

        return;
    }


    /* =====================================
       SCANNER MODE
    ===================================== */

    learnersSection.classList.add(
        "hidden"
    );

    chartGrid.classList.remove(
        "hidden"
    );

    subCategories.classList.remove(
        "hidden"
    );


    renderSubCategories(
        category
    );
}


/* =========================================
   SUB CATEGORIES
========================================= */

function renderSubCategories(category) {

    subCategories.innerHTML = "";

    const scanners =
        scannersData[category];

    if (!scanners) return;


    scanners.forEach(
        scanner => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                category === "wyckoff"
                    ? "sub-tile wyckoff"
                    : "sub-tile";


            button.innerHTML = `
                ${scanner.name}
                (${scanner.count})
            `;


            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".sub-tile"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );
                        });

                    button.classList.add(
                        "active"
                    );

                    loadCharts(
                        scanner
                    );
                }
            );


            subCategories.appendChild(
                button
            );
        }
    );


    const firstButton =
        subCategories.querySelector(
            ".sub-tile"
        );

    if (firstButton) {

        firstButton.click();
    }
}


/* =========================================
   LOAD CHARTS
========================================= */

async function loadCharts(scanner) {

    currentScanner = scanner;

    chartGrid.innerHTML = "";


    try {

        const response =
            await fetch(
                `${scanner.path}/charts/charts.json`
            );

        const pngs =
            await response.json();

        currentImages = pngs;


        if (!pngs.length) {

            chartGrid.innerHTML = `
                <p class="no-charts">
                    No charts available.
                </p>
            `;

            return;
        }


        pngs.forEach(
            (png, index) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "chart-card";


                const symbol =
                    png.replace(
                        ".png",
                        ""
                    );


                const imagePath =
                    `${scanner.path}/charts/${png}`;


                card.innerHTML = `

                    <div class="chart-image-wrapper">

                        <img
                            src="${imagePath}"
                            alt="${symbol}"
                            class="chart-image"
                            loading="lazy"
                        >

                        <a
                            href="https://www.tradingview.com/chart/?symbol=NSE:${symbol}"
                            target="_blank"
                            class="tv-link"
                        >
                            <img
                                src="icons/tradingview.png"
                                class="tv-icon"
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
                    e => {

                        if (
                            e.target.closest(
                                ".tv-link"
                            )
                        ) {
                            return;
                        }

                        openModal(index);
                    }
                );


                chartGrid.appendChild(
                    card
                );
            }
        );
    }

    catch (error) {

        console.error(error);

        chartGrid.innerHTML = `
            <p class="no-charts">
                Failed to load charts.
            </p>
        `;
    }
}


/* =========================================
   MODAL
========================================= */

function openModal(index) {

    currentImageIndex = index;

    updateModalImage();

    modal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}


function updateModalImage() {

    if (
        !currentScanner ||
        !currentImages.length
    ) return;


    modalImage.src =
        `${currentScanner.path}/charts/${currentImages[currentImageIndex]}`;
}


function closeModalFunction() {

    modal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "auto";
}


/* =========================================
   MODAL EVENTS
========================================= */

closeModal.addEventListener(
    "click",
    closeModalFunction
);

modal.addEventListener(
    "click",
    e => {

        if (e.target === modal) {

            closeModalFunction();
        }
    }
);


prevArrow.addEventListener(
    "click",
    () => {

        if (
            currentImageIndex > 0
        ) {

            currentImageIndex--;

            updateModalImage();
        }
    }
);


nextArrow.addEventListener(
    "click",
    () => {

        if (
            currentImageIndex <
            currentImages.length - 1
        ) {

            currentImageIndex++;

            updateModalImage();
        }
    }
);


/* =========================================
   KEYBOARD NAVIGATION
========================================= */

document.addEventListener(
    "keydown",
    e => {

        if (
            modal.classList.contains(
                "hidden"
            )
        ) {
            return;
        }


        if (e.key === "Escape") {

            closeModalFunction();
        }


        if (
            e.key === "ArrowRight" &&
            currentImageIndex <
            currentImages.length - 1
        ) {

            currentImageIndex++;

            updateModalImage();
        }


        if (
            e.key === "ArrowLeft" &&
            currentImageIndex > 0
        ) {

            currentImageIndex--;

            updateModalImage();
        }
    }
);


/* =========================================
   TOUCH SWIPE
========================================= */

let touchStartX = 0;

let touchEndX = 0;

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


        if (
            touchEndX <
            touchStartX - 50 &&
            currentImageIndex <
            currentImages.length - 1
        ) {

            currentImageIndex++;

            updateModalImage();
        }


        if (
            touchEndX >
            touchStartX + 50 &&
            currentImageIndex > 0
        ) {

            currentImageIndex--;

            updateModalImage();
        }
    }
);


/* =========================================
   LAST UPDATED
========================================= */

async function loadLastUpdated() {

    try {

        const response =
            await fetch(
                "data/last_updated.json"
            );

        const data =
            await response.json();

        lastUpdated.innerHTML =
            "Last Updated: " +
            data.last_updated;
    }

    catch {

        lastUpdated.innerHTML =
            "Last Updated: Unknown";
    }
}


/* =========================================
   INIT
========================================= */

loadScanners();