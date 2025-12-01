/* ---------------------------
   Screen switching
   --------------------------- */
function goToScreen(num){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen" + num).classList.add("active");

  // reset typewriter if returning to cake screen repeatedly
  if(num === 3) {
    document.getElementById("typeMessage").textContent = "";
    typedIndex = 0;
    // ensure wish hidden until cake clicked
    document.getElementById("wishBox").classList.add("hidden");
  }
}

/* ---------------------------
   Carousel (single-image) setup
   --------------------------- */
const track = document.getElementById("carouselTrack");
const slides = Array.from(document.querySelectorAll(".slide"));
const total = slides.length;

let current = 0;

// ensure starting transform
function goToCurrent() {
  // each slide width is computed from first slide
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${current * slideWidth}px)`;
}

// next / prev
document.getElementById("nextBtn").addEventListener("click", () => {
  current = (current + 1) % total;
  goToCurrent();
});
document.getElementById("prevBtn").addEventListener("click", () => {
  current = (current - 1 + total) % total;
  goToCurrent();
});

// initialize position after images load
window.addEventListener("load", () => {
  goToCurrent();
});

/* ---------------------------
   Drag / Swipe support
   --------------------------- */
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

const viewport = document.querySelector(".carousel-viewport");
const slideWidth = () => slides[0].getBoundingClientRect().width;

viewport.addEventListener('pointerdown', pointerDown);
viewport.addEventListener('pointerup', pointerUp);
viewport.addEventListener('pointerleave', pointerUp);
viewport.addEventListener('pointermove', pointerMove);

function pointerDown(e){
  isDragging = true;
  startX = e.clientX;
  viewport.setPointerCapture(e.pointerId);
}
function pointerMove(e){
  if(!isDragging) return;
  const dx = e.clientX - startX;
  track.style.transition = 'none';
  track.style.transform = `translateX(-${current * slideWidth() - dx}px)`;
}
function pointerUp(e){
  if(!isDragging) return;
  isDragging = false;
  const dx = e.clientX - startX;
  const threshold = slideWidth() * 0.25;
  if (dx < -threshold) {
    current = (current + 1) % total;
  } else if (dx > threshold) {
    current = (current - 1 + total) % total;
  }
  track.style.transition = 'transform .45s cubic-bezier(.22,.9,.31,1)';
  goToCurrent();
}

/* ---------------------------
   Cake click -> wish + typewriter + floating
   --------------------------- */
function showWish() {
  const box = document.getElementById("wishBox");
  box.classList.remove("hidden");
  startTyping();
  startFloating();
}

/* ---------------------------
   Typewriter
   --------------------------- */
const message = `Happy Birthday, My Love ❤️
You make my world softer, happier and magical.
Thank you for being the best part of my life.
Thank you for being the reason behind my brightest smiles. I’m so lucky to call you mine. I hope today is as amazing as you are to me. 💫
You make life warmer, happier, and so full of love. Thank you for being patient, kind, and mine. I hope this year brings you everything you dream of—because you deserve the best.

Your Love,
Kashu.....`;

let typedIndex = 0;
function startTyping(){
  const out = document.getElementById("typeMessage");
  if (typedIndex === 0) out.textContent = "";
  if (typedIndex < message.length) {
    out.textContent += message.charAt(typedIndex);
    typedIndex++;
    setTimeout(startTyping, 36);
  }
}

/* ---------------------------
   Floating hearts (non-blocking)
   --------------------------- */
function startFloating(){
  const area = document.getElementById("floating");

  // create some bursts
  const burstCount = 18;
  for(let i=0;i<burstCount;i++){
    createFloatItem(area, i * 200);
  }
}

function createFloatItem(area, delay){
  setTimeout(() => {
    const el = document.createElement("div");
    el.className = "floatItem";
    // choose heart or balloon emoji
    const emojis = ["🎈","💖","🎈","💘","💖"];
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    const size = 18 + Math.random()*28;
    el.style.fontSize = size + "px";
    el.style.left = Math.random() * (window.innerWidth - 40) + "px";
    el.style.bottom = "-40px";
    el.style.opacity = 0.95;
    el.style.animationDuration = (4 + Math.random()*4) + "s";
    area.appendChild(el);

    // remove after animation end
    setTimeout(()=> {
      el.remove();
    }, 9000);
  }, delay);
}

/* make sure floating area doesn't capture pointer events */
document.getElementById("floating").style.pointerEvents = "none";
