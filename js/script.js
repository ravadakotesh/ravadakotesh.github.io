

// ================= LOADER =================


window.addEventListener("load", function(){

const loader = document.getElementById("loader");

if(loader){

loader.style.display="none";

}

});




// ================= DARK MODE =================


const themeButton = document.getElementById("theme-toggle");


if(themeButton){


themeButton.addEventListener("click", function(){


document.body.classList.toggle("dark-mode");



localStorage.setItem(

"theme",

document.body.classList.contains("dark-mode")

? "dark"

: "light"

);


});


}




// Load saved theme


if(localStorage.getItem("theme")==="dark"){


document.body.classList.add("dark-mode");


}







// ================= MOBILE MENU =================


const hamburger = document.getElementById("hamburger");

const navLinks = document.querySelector(".nav-links");



if(hamburger){


hamburger.addEventListener("click",function(){


navLinks.classList.toggle("show");


});


}







// ================= BACK TO TOP =================


const topButton = document.getElementById("back-to-top");



if(topButton){


topButton.addEventListener("click",function(){


window.scrollTo({

top:0,

behavior:"smooth"

});


});


}






// ================= CLOSE MOBILE MENU =================



document.querySelectorAll(".nav-links a").forEach(link=>{


link.addEventListener("click",()=>{


if(navLinks){

navLinks.classList.remove("show");

}


});


});

/* ==========================================================
   Project Page - 3D Viewer Controls
========================================================== */

const viewer = document.getElementById("project-model");

if (viewer) {

    const rotateBtn = document.getElementById("rotate-btn");
    const resetBtn = document.getElementById("reset-btn");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const explodeBtn = document.getElementById("explode-btn");

    /* ---------------- Default Camera ---------------- */

    const DEFAULT_CAMERA_ORBIT = "45deg 75deg 65%";
    const DEFAULT_CAMERA_TARGET = "auto auto auto";

    /* ---------------- Current Model ---------------- */

    const normalModel = viewer.getAttribute("src");
    const explodedModel = normalModel.replace(".glb", "_exploded.glb");

    let exploded = false;

    /* ---------------- Auto Rotate ---------------- */

    let rotating = true;

    viewer.autoRotate = true;

    rotateBtn.innerHTML = "⟳ Turn Auto Rotate OFF";

    rotateBtn.addEventListener("click", () => {

        rotating = !rotating;

        if (rotating) {

            viewer.setAttribute("auto-rotate", "");
            viewer.autoRotate = true;
            rotateBtn.innerHTML = "⟳ Turn Auto Rotate OFF";

        } else {

            viewer.removeAttribute("auto-rotate");
            viewer.autoRotate = false;
            rotateBtn.innerHTML = "⟳ Turn Auto Rotate ON";

        }

    });

    /* ---------------- Reset View ---------------- */

    resetBtn.addEventListener("click", () => {

        viewer.cameraOrbit = DEFAULT_CAMERA_ORBIT;
        viewer.cameraTarget = DEFAULT_CAMERA_TARGET;

        viewer.jumpCameraToGoal();

    });

    /* ---------------- Full Screen ---------------- */

    const viewerContainer = document.querySelector(".project-viewer");

    fullscreenBtn.addEventListener("click", async () => {

        if (!document.fullscreenElement) {

            await viewerContainer.requestFullscreen();
            fullscreenBtn.innerHTML = "🡼 Exit Full Screen";

        } else {

            await document.exitFullscreen();
            fullscreenBtn.innerHTML = "⛶ Full Screen";

        }

    });

    document.addEventListener("fullscreenchange", () => {

        if (!document.fullscreenElement) {

            fullscreenBtn.innerHTML = "⛶ Full Screen";

        }

    });

    /* ---------------- Check Exploded Model ---------------- */

    fetch(explodedModel, { method: "HEAD" })

    .then(response => {

        if (!response.ok) {

            explodeBtn.style.display = "none";

        }

    })

    .catch(() => {

        explodeBtn.style.display = "none";

    });

    /* ---------------- Explode / Assemble ---------------- */

    explodeBtn.addEventListener("click", () => {

        viewer.style.opacity = "0";

        setTimeout(() => {

            if (!exploded) {

                viewer.src = explodedModel;
                explodeBtn.innerHTML = "🧩 Assemble";

            } else {

                viewer.src = normalModel;
                explodeBtn.innerHTML = "💥 Explode";

            }

            exploded = !exploded;

        }, 250);

    });

    /* ---------------- Model Loaded ---------------- */

    viewer.addEventListener("load", () => {

        viewer.cameraOrbit = DEFAULT_CAMERA_ORBIT;
        viewer.cameraTarget = DEFAULT_CAMERA_TARGET;

        viewer.jumpCameraToGoal();

        if (rotating) {

            viewer.setAttribute("auto-rotate", "");
            viewer.autoRotate = true;

        }

        viewer.style.opacity = "1";

    });

}

/* ==========================================================
   Contact Form - Web3Forms
========================================================== */

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    const submitBtn = document.getElementById("submit-btn");
    const status = document.getElementById("form-status");

    contactForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";
        status.innerHTML = "";

        const formData = new FormData(contactForm);

        try {

            const response = await fetch("https://api.web3forms.com/submit", {

                method: "POST",

                body: formData

            });

            const result = await response.json();

            if (result.success) {

                status.innerHTML = "✅ Thank you! Your message has been sent successfully.";
                status.style.color = "#16a34a";

                contactForm.reset();

            } else {

                status.innerHTML = "❌ Something went wrong. Please try again.";
                status.style.color = "#dc2626";

            }

        } catch (error) {

            status.innerHTML = "❌ Unable to send your message. Please try again.";
            status.style.color = "#dc2626";

        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = "Send Message";

    });

}


/* ==========================================================
   DRAWING VIEWER
========================================================== */

const drawings = document.querySelectorAll(".drawing-gallery img");

const lightbox = document.getElementById("drawing-lightbox");
const lightboxImg = document.getElementById("lightbox-image");

const closeBtn = document.getElementById("close-lightbox");

const prevBtn = document.getElementById("prev-drawing");
const nextBtn = document.getElementById("next-drawing");

const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const resetBtn = document.getElementById("reset-zoom");

const counter = document.getElementById("drawing-counter");

let currentIndex = 0;

let scale = 1;
let translateX = 0;
let translateY = 0;

let dragging = false;
let startX = 0;
let startY = 0;

function updateTransform(){

    lightboxImg.style.transform =
    `translate(${translateX}px,${translateY}px) scale(${scale})`;

}

function resetView(){

    scale=1;

    translateX=0;
    translateY=0;

    lightboxImg.style.cursor="default";

    updateTransform();

}

function openDrawing(index){

    currentIndex = index;

    lightbox.classList.add("active");

    lightboxImg.src = drawings[index].src;

    counter.innerHTML = `${index+1} / ${drawings.length}`;

    if(drawings.length<=1){

        prevBtn.style.display="none";
        nextBtn.style.display="none";

    }else{

        prevBtn.style.display="inline-block";
        nextBtn.style.display="inline-block";

    }

    resetView();

}

drawings.forEach((img,index)=>{

    img.addEventListener("click",()=>{

        openDrawing(index);

    });

});

closeBtn.addEventListener("click",()=>{

    lightbox.classList.remove("active");

});

lightbox.addEventListener("click",(e)=>{

    if(e.target===lightbox){

        lightbox.classList.remove("active");

    }

});

document.addEventListener("keydown",(e)=>{

    if(!lightbox.classList.contains("active")) return;

    if(e.key==="Escape"){

        lightbox.classList.remove("active");

    }

    if(e.key==="ArrowRight"){

        nextBtn.click();

    }

    if(e.key==="ArrowLeft"){

        prevBtn.click();

    }

});

nextBtn.addEventListener("click",()=>{

    currentIndex++;

    if(currentIndex>=drawings.length){

        currentIndex=0;

    }

    openDrawing(currentIndex);

});

prevBtn.addEventListener("click",()=>{

    currentIndex--;

    if(currentIndex<0){

        currentIndex=drawings.length-1;

    }

    openDrawing(currentIndex);

});

zoomInBtn.addEventListener("click",()=>{

    scale=Math.min(5,scale+0.2);

    updateTransform();

});

zoomOutBtn.addEventListener("click",()=>{

    scale=Math.max(.5,scale-0.2);

    if(scale===1){

        translateX=0;
        translateY=0;

    }

    updateTransform();

});

resetBtn.addEventListener("click",()=>{

    resetView();

});

lightboxImg.addEventListener("wheel",(e)=>{

    e.preventDefault();

    if(e.deltaY<0){

        scale=Math.min(5,scale+0.1);

    }else{

        scale=Math.max(.5,scale-0.1);

    }

    if(scale===1){

        translateX=0;
        translateY=0;

    }

    updateTransform();

});

lightboxImg.addEventListener("mousedown",(e)=>{

    if(scale<=1) return;

    dragging=true;

    startX=e.clientX-translateX;
    startY=e.clientY-translateY;

    lightboxImg.style.cursor="grabbing";

});

document.addEventListener("mousemove",(e)=>{

    if(!dragging) return;

    translateX=e.clientX-startX;
    translateY=e.clientY-startY;

    updateTransform();

});

document.addEventListener("mouseup",()=>{

    dragging=false;

    lightboxImg.style.cursor=scale>1?"grab":"default";

});

lightboxImg.addEventListener("dblclick",()=>{

    resetView();

});

lightboxImg.addEventListener("dragstart",(e)=>{

    e.preventDefault();

});

/* ==========================================================
   AUTOMATIC PROJECT NAVIGATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const prevBtn = document.getElementById("previous-project");
    const nextBtn = document.getElementById("next-project");

    if (!prevBtn || !nextBtn) return;

    const pages = [
        "project1.html",
        "project2.html",
        "project3.html",
        "project4.html",
        "project5.html"
    ];

    const currentPage = window.location.pathname.split("/").pop();
    const currentIndex = pages.indexOf(currentPage);

    if (currentIndex === -1) return;

    // Previous Project
    if (currentIndex > 0) {
        prevBtn.style.display = "inline-flex";
        prevBtn.href = pages[currentIndex - 1];
    }

    // Next Project
    if (currentIndex < pages.length - 1) {
        nextBtn.style.display = "inline-flex";
        nextBtn.href = pages[currentIndex + 1];
    }

});