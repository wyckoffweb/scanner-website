let images = [];
let index = 0;

/* STRATEGY TEXT (keep as is) */
const STRATEGY_TEXT = {
    breakout: `📈 Breakout\n\n• Resistance breakout\n• Volume expansion\n\n→ SIGNAL`,
    ema50_pullback: `📉 EMA Pullback\n\n• HTF uptrend\n• Close > EMA50 > EMA200\n• Pullback\n\n→ SIGNAL`,
    ema20_trend: `📊 EMA20 Trend\n\n• Strong trend\n• EMA20 support\n\n→ MOMENTUM`,
    rsi_momentum: `⚡ RSI Momentum\n\n• RSI > 60\n\n→ MOMENTUM`,
    bollinger: `📦 Bollinger\n\n• Squeeze\n• Expansion\n\n→ VOLATILITY`,
    golden_cross: `🏆 Golden Cross\n\n• EMA50 > EMA200\n\n→ POSITIONAL`,
    confluence: `🔥 Confluence\n\n• Multi-signal overlap\n\n→ BEST SETUPS`
};

/* TAB */
function showTab(tab){
    document.getElementById("swing").style.display = tab==="swing"?"block":"none";
    document.getElementById("wyckoff").style.display = tab==="wyckoff"?"block":"none";
}

/* STRATEGY PANEL */
function updateStrategyPanel(name){
    const panel = document.getElementById("strategy-panel");
    if(!panel) return;
    panel.innerText = STRATEGY_TEXT[name] || "Strategy info";
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

/* MODAL OPEN */
function openModal(i){
    index=i;
    const modal = document.getElementById("modal");
    modal.style.display="flex";
    updateImage();
}

/* UPDATE IMAGE */
function updateImage(){
    document.getElementById("modal-img").src = images[index] + "?t=" + Date.now();
    updateCounter();
}

/* CLOSE */
function closeModal(){
    document.getElementById("modal").style.display="none";
}

/* NAVIGATION */
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

/* KEYBOARD CONTROL */
document.addEventListener("keydown", (e)=>{
    const modalOpen = document.getElementById("modal").style.display === "flex";
    if(!modalOpen) return;

    if(e.key === "ArrowRight") nextImage();
    if(e.key === "ArrowLeft") prevImage();
    if(e.key === "Escape") closeModal();
});

/* TOUCH SWIPE */
let touchStartX = 0;

document.getElementById("modal").addEventListener("touchstart", e=>{
    touchStartX = e.changedTouches[0].screenX;
});

document.getElementById("modal").addEventListener("touchend", e=>{
    let diff = e.changedTouches[0].screenX - touchStartX;

    if(diff > 50) prevImage();     // swipe right
    if(diff < -50) nextImage();    // swipe left
});

/* COUNTER */
function updateCounter(){
    const el = document.getElementById("chart-counter");
    if(el){
        el.innerText = `${index+1} / ${images.length}`;
    }
}

/* NAV */
function goToConfluence(){
    showTab("swing");
    loadImages("swing/confluence","swing-confluence");
    updateStrategyPanel("confluence");
}

function goToStrategy(s){
    showTab("swing");
    loadImages(`swing/${s}`,"strategy-results");
    updateStrategyPanel(s);
}

function goToWyckoff(){
    showTab("wyckoff");
    loadImages("wyckoff/ranking/charts","ranking");
}

/* INIT */
window.onload=()=>{
    loadImages("swing/confluence","swing-confluence");
    loadImages("wyckoff/ranking/charts","ranking");
};
