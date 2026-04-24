let images = [];
let index = 0;

/* LOAD SECTION */
function loadSection(name, el){

    highlightTile(el);

    const map = {
        confluence: ["🔥 Confluence","swing/confluence","count-confluence"],
        breakout: ["📈 Breakout","swing/breakout","count-breakout"],
        ema50_pullback: ["📉 EMA Pullback","swing/ema50_pullback","count-ema50_pullback"],
        ema20_trend: ["📊 EMA20 Trend","swing/ema20_trend","count-ema20_trend"],
        rsi_momentum: ["⚡ RSI","swing/rsi_momentum","count-rsi_momentum"],
        bollinger: ["📦 Bollinger","swing/bollinger","count-bollinger"],
        golden_cross: ["🏆 Golden Cross","swing/golden_cross","count-golden_cross"],
        ranking: ["🏆 Wyckoff Ranking","wyckoff/ranking/charts","count-ranking"]
    };

    const [title, folder, countId] = map[name];

    document.getElementById("section-title").innerText = title;

    fetch(`data/${folder}/index.json?t=` + Date.now())
    .then(r=>r.json())
    .then(files=>{

        const grid = document.getElementById("main-grid");
        grid.innerHTML = "";

        if(!files || files.length === 0){
            grid.innerHTML = "No setups today";
            document.getElementById(countId).innerText = "(0)";
            return;
        }

        document.getElementById(countId).innerText = `(${files.length})`;

        images = files.map(f=>`data/${folder}/${f}`);

        files.forEach((f,i)=>{

            const card = document.createElement("div");
            card.className="card";

            card.innerHTML=`
                <img src="data/${folder}/${f}?t=${Date.now()}">
                <button class="tv-btn" onclick="openTV(event,'${f}')">TV</button>
            `;

            card.onclick = ()=>openModal(i);

            grid.appendChild(card);
        });

    });
}

/* ACTIVE TILE */
function highlightTile(el){
    document.querySelectorAll(".tile").forEach(t=>t.classList.remove("active"));
    el.classList.add("active");
}

/* LAST UPDATED */
function loadLastUpdated(){
    fetch("data/last_updated.json?t="+Date.now())
    .then(r=>r.json())
    .then(d=>{
        document.getElementById("last-updated").innerText =
            "Last updated: " + d.updated;
    })
    .catch(()=>{
        document.getElementById("last-updated").innerText =
            "Last updated: unavailable";
    });
}

/* MODAL */
function openModal(i){
    index=i;
    document.getElementById("modal").style.display="flex";
    updateImage();
}

function updateImage(){
    document.getElementById("modal-img").src=images[index];
    document.getElementById("chart-counter").innerText =
        `${index+1} / ${images.length}`;
}

function nextImage(){ if(index<images.length-1){index++;updateImage();}}
function prevImage(){ if(index>0){index--;updateImage();}}
function closeModal(){ document.getElementById("modal").style.display="none";}

/* KEYBOARD */
document.addEventListener("keydown",e=>{
    if(document.getElementById("modal").style.display!=="flex") return;
    if(e.key==="ArrowRight") nextImage();
    if(e.key==="ArrowLeft") prevImage();
    if(e.key==="Escape") closeModal();
});

/* SCROLL */
function scrollToTop(){
    window.scrollTo({top:0,behavior:"smooth"});
}

/* INIT */
window.onload=()=>{
    loadLastUpdated();
    loadSection("confluence", document.querySelector(".tile"));
};
