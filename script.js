let images = [];
let index = 0;

/* STRATEGY TEXT */
const STRATEGY_TEXT = {
    breakout: "📈 Breakout\n\n→ Resistance break + volume",
    ema50_pullback: "📉 EMA50 Pullback\n\n→ Trend + pullback",
    ema20_trend: "📊 EMA20 Trend\n\n→ Momentum continuation",
    rsi_momentum: "⚡ RSI Momentum\n\n→ Strong move",
    bollinger: "📦 Bollinger\n\n→ Volatility expansion",
    golden_cross: "🏆 Golden Cross\n\n→ Trend shift",
    confluence: "🔥 Confluence\n\n→ Multi-signal setups"
};

/* TAB */
function showTab(tab){
    document.getElementById("swing").style.display = tab==="swing"?"block":"none";
    document.getElementById("wyckoff").style.display = tab==="wyckoff"?"block":"none";
}

/* SCROLL HELPER */
function scrollToSection(id){
    setTimeout(()=>{
        const el = document.getElementById(id);
        if(el){
            el.scrollIntoView({behavior:"smooth"});
        }
    }, 200); // wait for DOM render
}

/* STRATEGY PANEL */
function updateStrategyPanel(name){
    const panel = document.getElementById("strategy-panel");
    if(panel){
        panel.innerText = STRATEGY_TEXT[name] || "";
    }
}

/* LOAD IMAGES */
function loadImages(folder, id){
    fetch(`data/${folder}/index.json?t=`+Date.now())
    .then(r=>r.json())
    .then(files=>{
        const c=document.getElementById(id);
        c.innerHTML="";

        if (!files || files.length === 0) {
            c.innerHTML = `<div style="text-align:center;padding:30px;">No setups today</div>`;
            return;
        }

        images = files.map(f=>`data/${folder}/${f}`);

        files.forEach((f,i)=>{
            const div=document.createElement("div");
            div.className="card";

            div.innerHTML=`
                <img src="data/${folder}/${f}?t=${Date.now()}">
                <button class="tv-btn" onclick="openTV(event,'${f}')">TradingView</button>
            `;

            div.onclick=()=>openModal(i);
            c.appendChild(div);
        });
    });
}

/* TRADINGVIEW */
function openTV(e,f){
    e.stopPropagation();
    const s=f.replace(".png","");
    window.open(`https://www.tradingview.com/chart/?symbol=NSE:${s}`);
}

/* MODAL */
function openModal(i){
    index=i;
    document.getElementById("modal").style.display="flex";
    updateImage();
}

function updateImage(){
    document.getElementById("modal-img").src = images[index]+"?t="+Date.now();
    updateCounter();
}

function closeModal(){
    document.getElementById("modal").style.display="none";
}

/* NAV */
function nextImage(){
    if(index < images.length-1){
        index++;
        updateImage();
    }
}

function prevImage(){
    if(index > 0){
        index--;
        updateImage();
    }
}

/* KEYBOARD */
document.addEventListener("keydown",(e)=>{
    if(document.getElementById("modal").style.display !== "flex") return;

    if(e.key==="ArrowRight") nextImage();
    if(e.key==="ArrowLeft") prevImage();
    if(e.key==="Escape") closeModal();
});

/* SWIPE */
let touchStartX = 0;

document.addEventListener("touchstart", e=>{
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e=>{
    let diff = e.changedTouches[0].screenX - touchStartX;

    if(diff > 50) prevImage();
    if(diff < -50) nextImage();
});

/* COUNTER */
function updateCounter(){
    const el = document.getElementById("chart-counter");
    if(el){
        el.innerText = `${index+1} / ${images.length}`;
    }
}

/* TILE NAVIGATION (FIXED) */
function goToConfluence(){
    showTab("swing");
    loadImages("swing/confluence","swing-confluence");
    updateStrategyPanel("confluence");
    scrollToSection("swing-confluence");
}

function goToStrategy(s){
    showTab("swing");
    loadImages(`swing/${s}`,"strategy-results");
    updateStrategyPanel(s);
    scrollToSection("strategy-results");
}

function goToWyckoff(){
    showTab("wyckoff");
    loadImages("wyckoff/ranking/charts","ranking");
    scrollToSection("ranking");
}

/* INIT */
window.onload=()=>{
    loadImages("swing/confluence","swing-confluence");
    loadImages("wyckoff/ranking/charts","ranking");
};
