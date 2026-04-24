let images = [];
let index = 0;

/* LOAD SECTION */
function loadSection(name){

    const map = {
        confluence: ["🔥 Confluence","swing/confluence"],
        breakout: ["📈 Breakout","swing/breakout"],
        ema50_pullback: ["📉 EMA Pullback","swing/ema50_pullback"],
        ema20_trend: ["📊 EMA20 Trend","swing/ema20_trend"],
        rsi_momentum: ["⚡ RSI","swing/rsi_momentum"],
        bollinger: ["📦 Bollinger","swing/bollinger"],
        golden_cross: ["🏆 Golden Cross","swing/golden_cross"],
        ranking: ["🏆 Wyckoff Ranking","wyckoff/ranking/charts"]
    };

    const [title, folder] = map[name];

    document.getElementById("section-title").innerText = title;

    fetch(`data/${folder}/index.json?t=` + Date.now())
    .then(r=>r.json())
    .then(files=>{

        const grid = document.getElementById("main-grid");
        grid.innerHTML = "";

        if(!files || files.length === 0){
            grid.innerHTML = "<div>No setups today</div>";
            return;
        }

        images = files.map(f=>`data/${folder}/${f}`);

        files.forEach((f,i)=>{

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="data/${folder}/${f}?t=${Date.now()}">
                <button class="tv-btn" onclick="openTV(event,'${f}')">TV</button>
            `;

            card.onclick = ()=>openModal(i);

            grid.appendChild(card);
        });

    });

    setTimeout(()=>{
        document.getElementById("main-section").scrollIntoView({
            behavior:"smooth"
        });
    },200);
}

/* MODAL */
function openModal(i){
    index = i;
    document.getElementById("modal").style.display = "flex";
    updateImage();
}

function updateImage(){
    document.getElementById("modal-img").src = images[index];
    document.getElementById("chart-counter").innerText =
        `${index+1} / ${images.length}`;
}

function nextImage(){ if(index < images.length-1){ index++; updateImage(); } }
function prevImage(){ if(index > 0){ index--; updateImage(); } }

function closeModal(){
    document.getElementById("modal").style.display = "none";
}

/* TV */
function openTV(e,f){
    e.stopPropagation();
    const s=f.replace(".png","");
    window.open(`https://www.tradingview.com/chart/?symbol=NSE:${s}`);
}

/* SCROLL */
function scrollToTop(){
    window.scrollTo({top:0,behavior:"smooth"});
}

/* INIT */
window.onload = ()=>{
    loadSection("confluence");
};
