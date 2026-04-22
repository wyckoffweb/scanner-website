function showTab(tab) {
    document.getElementById('swing').classList.add('hidden');
    document.getElementById('wyckoff').classList.add('hidden');

    document.getElementById(tab).classList.remove('hidden');
}

// Load images from folder
function loadImages(folder, elementId) {

    const container = document.getElementById(elementId);
    container.innerHTML = "";

    fetch(`data/${folder}/`)
    .then(response => response.text())
    .then(text => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const links = htmlDoc.querySelectorAll("a");

        links.forEach(link => {
            if (link.href.endsWith(".png")) {
                const img = document.createElement("img");
                img.src = link.href;
                container.appendChild(img);
            }
        });
    });
}

// Swing strategies
function loadStrategy(name) {
    loadImages(`swing/${name}`, "strategy-results");
}

// Initial load
window.onload = () => {

    loadImages("swing/confluence", "swing-confluence");

    loadImages("wyckoff/daily/charts", "daily");
    loadImages("wyckoff/weekly/charts", "weekly");
    loadImages("wyckoff/monthly/charts", "monthly");
    loadImages("wyckoff/ranking/charts", "ranking");
};
