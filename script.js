let imagesMap = {};   // 🔥 FIX: store images per section
let currentImages = [];
let index = 0;

/* LAST UPDATED */
function loadLastUpdated() {
    fetch("data/last_updated.json?t=" + Date.now())
    .then(res => res.json())
    .then(data => {
        document.getElementById("last-updated").innerText =
            "Last updated: " + data.updated;
    })
    .catch(() => {
        document.getElementById("last-updated").innerText =
            "Last updated: unavailable";
    });
}

/* LOAD IMAGES (FIXED) */
function loadImages(folder, id){

    fetch(`data/${folder}/index.json?t=`+Date.now())
    .then(r=>r.json())
    .then(files=>{
        const c=document.getElementById(id);
        c.innerHTML="";

        if (!files || files.length === 0) {
            c.innerHTML = `
                <div style="text-align:center;padding:30px;">
                    No stocks met this condition today.<br>
                    Check tomorrow.
                </div>`;
            return;
        }

        // 🔥 store per section
        imagesMap[id] = files.map(f=>`data/${folder}/${f}`);

        files.forEach((f,i)=>{
            const div=document.createElement("div");
            div.className="card";

            div.innerHTML=`
                <img src="data/${folder}/${f}?t=${Date.now()}">
                <button class="tv-btn" onclick="openTV(event,'${f}')">TradingView</button>
            `;

            // 🔥 FIX: use correct image set
            div.onclick=()=>openModal(id, i);

            c.appendChild(div);
        });
    });
}

/* MODAL OPEN (FIXED) */
function openModal(sectionId, i){
    currentImages = imagesMap[sectionId];
    index = i;

    document.getElementById("modal").style.display="flex";
    updateImage();
}

/* UPDATE IMAGE */
function updateImage(){
    document.getElementById("modal-img").src =
        currentImages[index] + "?t=" + Date.now();

    document.getElementById("chart-counter").innerText =
        `${index+1} / ${currentImages.length}`;
}

/* NAVIGATION */
function nextImage(){
    if(index < currentImages.length-1){
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

/* CLOSE */
function closeModal(){
    document.getElementById("modal").style.display="none";
}

/* KEYBOARD */
document.addEventListener("keydown",(e)=>{
    if(document.getElementById("modal").style.display !== "flex") return;

    if(e.key==="ArrowRight") nextImage();
    if(e.key==="ArrowLeft") prevImage();
    if(e.key==="Escape") closeModal();
});

/* SWIPE */
let startX = 0;

document.addEventListener("touchstart", e=>{
    startX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e=>{
    let diff = e.changedTouches[0].screenX - startX;

    if(diff > 50) prevImage();
    if(diff < -50) nextImage();
});

/* NAV */
function goToConfluence(){
    loadImages("swing/confluence","swing-confluence");
    scrollTo("swing-confluence");
}

function goToStrategy(s){
    loadImages(`swing/${s}`,"strategy-results");
    scrollTo("strategy-results");
}

function goToWyckoff(){
    loadImages("wyckoff/ranking/charts","ranking");
    scrollTo("ranking");
}

/* SCROLL */
function scrollTo(id){
    setTimeout(()=>{
        document.getElementById(id).scrollIntoView({
            behavior:"smooth"
        });
    },200);
}

/* BACK TO TOP */
function scrollToTop(){
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

/* INIT */
window.onload=()=>{
    loadLastUpdated();
    loadImages("swing/confluence","swing-confluence");
    loadImages("wyckoff/ranking/charts","ranking");
};
