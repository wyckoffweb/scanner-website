let images = [];
let index = 0;

/* STRATEGY TEXT */
const STRATEGY_TEXT = {

    breakout: `📈 Breakout Strategy

• Price near resistance
• Volume expansion
• Range breakout

→ SIGNAL`,

    ema50_pullback: `📉 EMA Pullback

• Higher timeframe uptrend
• Close > EMA50 > EMA200
• Pullback to EMA50
• RSI 40–60

→ SIGNAL`,

    ema20_trend: `📊 EMA20 Trend

• Strong trend continuation
• Price riding EMA20
• Higher highs structure

→ MOMENTUM`,

    rsi_momentum: `⚡ RSI Momentum

• RSI > 60
• Strong price expansion

→ MOMENTUM`,

    bollinger: `📦 Bollinger

• Volatility contraction
• Band squeeze
• Expansion breakout

→ VOLATILITY PLAY`,

    golden_cross: `🏆 Golden Cross

• EMA50 crosses EMA200
• Trend reversal

→ POSITIONAL`,

    confluence: `🔥 Confluence

• Appears in multiple scanners
• Multi-factor alignment

→ BEST SETUPS`
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

    if(name === "wyckoff"){
        panel.innerText = "🏆 Wyckoff Ranking\nTop scored accumulation stocks";
        return;
    }

    panel.innerText = STRATEGY_TEXT[name] || "Strategy info not available";
}

/* LAST UPDATED */
function loadLastUpdated() {
    fetch("data/last_updated.json?t=" + Date.now())
    .then(res => res.json())
    .then(data => {
        document.getElementById("last-updated").innerText =
            "Last updated: " + data.updated;
    });
}

/* COUNTS */
function loadCounts() {
    const map = {
        "count-confluence": "swing/confluence",
        "count-breakout": "swing/breakout",
        "count-ema50_pullback": "swing/ema50_pullback",
        "count-ema20_trend": "swing/ema20_trend",
        "count-rsi_momentum": "swing/rsi_momentum",
        "count-bollinger": "swing/bollinger",
        "count-golden_cross": "swing/golden_cross",
        "count-ranking": "wyckoff/ranking/charts"
    };

    Object.keys(map).forEach(id => {
        fetch(`data/${map[id]}/index.json?t=` + Date.now())
        .then(res => res.json())
        .then(files => {
            document.getElementById(id).innerText = `(${files.length})`;
        })
        .catch(() => {
            document.getElementById(id).innerText = "(0)";
        });
    });
}

/* COUNTER */
function updateCounter(){
    const el = document.getElementById("chart-counter");
    if(el){
        el.innerText = `${index+1} / ${images.length}`;
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
            c.innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <h3>No setups today</h3>
                    <p>No stocks met this scanner condition.</p>
                    <button onclick="goHome()" style="margin-top:10px;padding:8px 14px;background:#2563eb;border:none;color:white;border-radius:6px;">
                        ← Back to Scanner
                    </button>
                </div>
            `;
            return;
        }

        images=files.map(f=>`data/${folder}/${f}`);

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

/* TV */
function openTV(e,f){
    e.stopPropagation();
    const s=f.replace(".png","");
    window.open(`https://www.tradingview.com/chart/?symbol=NSE:${s}`);
}

/* MODAL */
function openModal(i){
    index=i;
    document.getElementById("modal").style.display="flex";
    document.getElementById("modal-img").src=images[i]+"?t="+Date.now();
    updateCounter();
}

function closeModal(){
    document.getElementById("modal").style.display="none";
}

/* NAV */
function nextImage(){
    if(index < images.length - 1){
        index++;
        document.getElementById("modal-img").src = images[index] + "?t=" + Date.now();
        updateCounter();
    }
}

function prevImage(){
    if(index > 0){
        index--;
        document.getElementById("modal-img").src = images[index] + "?t=" + Date.now();
        updateCounter();
    }
}

/* NAVIGATION */
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
    updateStrategyPanel("wyckoff");
}

/* BACK */
function goHome(){
    document.getElementById("tile-menu").scrollIntoView({behavior:"smooth"});
}

/* SCROLL */
window.onscroll=()=>{
    document.getElementById("topBtn").style.display =
        window.scrollY>300?"block":"none";
};

function scrollToTop(){
    window.scrollTo({top:0,behavior:"smooth"});
}

/* INIT */
window.onload=()=>{
    loadLastUpdated();
    loadCounts();
    loadImages("swing/confluence","swing-confluence");
    loadImages("wyckoff/ranking/charts","ranking");
    updateStrategyPanel("confluence");
};
