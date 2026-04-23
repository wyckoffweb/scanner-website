function showTab(tab) {
    document.getElementById('swing').classList.add('hidden');
    document.getElementById('wyckoff').classList.add('hidden');

    document.getElementById(tab).classList.remove('hidden');
}

function createCard(src) {

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = src;

    const label = document.createElement("div");
    label.className = "label";

    // Extract stock name
    const name = src.split("/").pop().replace(".png", "");
    label.innerText = name;

    card.appendChild(img);
    card.appendChild(label);

    card.onclick = () => openModal(src);

    return card;
}

function loadImages(folder, elementId) {

    const container = document.getElementById(elementId);
    container.innerHTML = "Loading...";

    fetch(`data/${folder}/index.json`)
    .then(res => res.json())
    .then(files => {

        container.innerHTML = "";

        files.forEach(file => {
            const path = `data/${folder}/${file}`;
            container.appendChild(createCard(path));
        });

    })
    .catch(() => {
        container.innerHTML = "No data";
    });
}

function loadStrategy(name) {
    loadImages(`swing/${name}`, "strategy-results");
}

function openModal(src) {
    const modal = document.getElementById("modal");
    const img = document.getElementById("modal-img");

    img.src = src;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

window.onload = () => {

    loadImages("swing/confluence", "swing-confluence");

    loadImages("wyckoff/daily/charts", "daily");
    loadImages("wyckoff/weekly/charts", "weekly");
    loadImages("wyckoff/monthly/charts", "monthly");
    loadImages("wyckoff/ranking/charts", "ranking");
};
