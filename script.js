let images = [];
let index = 0;

function showTab(tab){
    document.getElementById("swing").style.display = tab==="swing"?"block":"none";
    document.getElementById("wyckoff").style.display = tab==="wyckoff"?"block":"none";
}

function loadImages(folder, id){
    fetch(`data/${folder}/index.json?t=`+Date.now())
    .then(r=>r.json())
    .then(files=>{
        const c=document.getElementById(id);
        c.innerHTML="";
        images=files.map(f=>`data/${folder}/${f}`);

        files.forEach((f,i)=>{
            const div=document.createElement("div");
            div.className="card";

            div.innerHTML=`
                <img src="data/${folder}/${f}?t=${Date.now()}">
                <button class="tv-btn" onclick="openTV(event,'${f}')">TV</button>
            `;

            div.onclick=()=>openModal(i);
            c.appendChild(div);
        });
    });
}

function openTV(e,f){
    e.stopPropagation();
    const s=f.replace(".png","");
    window.open(`https://www.tradingview.com/chart/?symbol=NSE:${s}`);
}

function openModal(i){
    index=i;
    document.getElementById("modal").style.display="flex";
    document.getElementById("modal-img").src=images[i];
}

function closeModal(){
    document.getElementById("modal").style.display="none";
}

function nextImage(){ if(index<images.length-1) openModal(++index); }
function prevImage(){ if(index>0) openModal(--index); }

function goToConfluence(){
    showTab("swing");
    loadImages("swing/confluence","swing-confluence");
}

function goToStrategy(s){
    showTab("swing");
    loadImages(`swing/${s}`,"strategy-results");
}

function goToWyckoff(){
    showTab("wyckoff");
    loadImages("wyckoff/ranking/charts","ranking");
}

function scrollToTop(){
    window.scrollTo({top:0,behavior:"smooth"});
}

window.onload=()=>{
    loadImages("swing/confluence","swing-confluence");
    loadImages("wyckoff/ranking/charts","ranking");
};
