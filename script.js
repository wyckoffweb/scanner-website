let images = [];
let index = 0;

/* LOAD COUNTS */
function loadCounts(){

    const map = {
        confluence: "swing/confluence",
        breakout: "swing/breakout",
        ema50_pullback: "swing/ema50_pullback",
        ema20_trend: "swing/ema20_trend",
        rsi_momentum: "swing/rsi_momentum",
        bollinger: "swing/bollinger",
        golden_cross: "swing/golden_cross",
        ranking: "wyckoff/ranking/charts"
    };

    for (let key in map){
        fetch(`data/${map[key]}/index.json?t=${Date.now()}`)
        .then(r=>r.json())
        .then(files=>{
            document.getElementById("count-"+key).innerText = `(${files.length})`;
        })
        .catch(()=>{
            document.getElementById("count-"+key).innerText = "(0)";
        });
    }
}

/* LOAD SECTION */
function loadSection(name, el){

    document.querySelectorAll(".tile").forEach(t=>t.classList.remove("active"));
    if(el) el.classList.add("active");

    const map = {
        confluence: ["🔥 Multi-Signal Confluence","swing/confluence"],
        breakout: ["📈 Clean Breakout","swing/breakout"],
        ema50_pullback: ["📉 Precision Pullback","swing/ema50_pullback"],
        ema20_trend: ["📊 Momentum Continuation","swing/ema20_trend"],
        rsi_momentum: ["⚡ Momentum Ignition","swing/rsi_momentum"],
        bollinger: ["📦 Volatility Expansion","swing/bollinger"],
        golden_cross: ["🏆 Structural Trend Shift","swing/golden_cross"],
        ranking: ["🏆 Wyckoff Ranking","wyckoff/ranking/charts"]
    };

    const [title, folder] = map[name];

    document.getElementById("section-title").innerText = title;

    fetch(`data/${folder}/index.json?t=${Date.now()}`)
    .then(r=>r.json())
    .then(files=>{

        const grid = document.getElementById("main-grid");
        grid.innerHTML = "";

        if(!files || files.length === 0){
            grid.innerHTML = "No setups today";
            return;
        }

        images = files.map(f=>`data/${folder}/${f}?t=${Date.now()}`);

        files.forEach((f,i)=>{
            const symbol = f.replace(".png","");

            const div=document.createElement("div");
            div.className="card";

            div.innerHTML=`
                <img src="data/${folder}/${f}?t=${Date.now()}">
                <button class="tv-btn" onclick="openTV(event,'${symbol}')">
                    View on TradingView
                </button>
            `;

            div.onclick=()=>openModal(i);

            grid.appendChild(div);
        });

    });
}

/* TRADINGVIEW LINK */
function openTV(e, symbol){
    e.stopPropagation();
    window.open(`https://www.tradingview.com/chart/?symbol=NSE:${symbol}`);
}

/* MODAL */
function openModal(i){
    index=i;
    document.getElementById("modal").style.display="flex";
    updateImage();
}

function updateImage(){
    document.getElementById("modal-img").src = images[index];
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

/* SWIPE */
let startX=0;

document.addEventListener("touchstart", e=>{
    if(document.getElementById("modal").style.display!=="flex") return;
    startX=e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e=>{
    if(document.getElementById("modal").style.display!=="flex") return;
    let diff=e.changedTouches[0].screenX-startX;

    if(diff>60) prevImage();
    if(diff<-60) nextImage();
});

/* LAST UPDATED */
function loadLastUpdated(){
    fetch("data/last_updated.json?t="+Date.now())
    .then(r=>r.json())
    .then(d=>{
        document.getElementById("last-updated").innerText =
            "Last updated: " + d.updated;
    });
}

/* SCROLL */
function scrollToTop(){
    window.scrollTo({top:0,behavior:"smooth"});
}

/* INIT */
window.onload=()=>{
    loadLastUpdated();
    loadCounts();
    loadSection("confluence", document.querySelector(".tile"));
};
