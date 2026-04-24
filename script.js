let images = [];
let index = 0;

/* LOAD COUNTS FIRST (FIX) */
function loadAllCounts(){

    const map = {
        confluence: ["swing/confluence","count-confluence"],
        breakout: ["swing/breakout","count-breakout"],
        ema50_pullback: ["swing/ema50_pullback","count-ema50_pullback"],
        ema20_trend: ["swing/ema20_trend","count-ema20_trend"],
        rsi_momentum: ["swing/rsi_momentum","count-rsi_momentum"],
        bollinger: ["swing/bollinger","count-bollinger"],
        golden_cross: ["swing/golden_cross","count-golden_cross"],
        ranking: ["wyckoff/ranking/charts","count-ranking"]
    };

    Object.values(map).forEach(([folder, id])=>{
        fetch(`data/${folder}/index.json?t=`+Date.now())
        .then(r=>r.json())
        .then(files=>{
            document.getElementById(id).innerText =
                `(${files.length})`;
        })
        .catch(()=>{
            document.getElementById(id).innerText="(0)";
        });
    });
}

/* LOAD SECTION */
function loadSection(name, el){

    highlightTile(el);

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

        if(!files || files.length===0){
            grid.innerHTML = "No setups today";
            return;
        }

        images = files.map(f=>`data/${folder}/${f}`);

        files.forEach((f,i)=>{

            const div=document.createElement("div");
            div.className="card";

            div.innerHTML=`<img src="data/${folder}/${f}?t=${Date.now()}">`;

            div.onclick=()=>openModal(i);

            grid.appendChild(div);
        });

    });
}

/* TILE ACTIVE */
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
    });
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
let startX = 0;

document.addEventListener("touchstart", e=>{
    if(document.getElementById("modal").style.display!=="flex") return;
    startX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e=>{
    if(document.getElementById("modal").style.display!=="flex") return;

    let diff = e.changedTouches[0].screenX - startX;

    if(diff > 60) prevImage();
    if(diff < -60) nextImage();
});

/* SCROLL */
function scrollToTop(){
    window.scrollTo({top:0,behavior:"smooth"});
}

/* INIT */
window.onload=()=>{
    loadLastUpdated();
    loadAllCounts();   // 🔥 FIX
    loadSection("confluence", document.querySelector(".tile"));
};
