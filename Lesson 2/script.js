const msg = document.querySelector("#msg");
const msEl = document.querySelector("#ms");

const startBtn = document.querySelector("#start");
const tapBtn = document.querySelector("#tap");
const resetBtn = document.querySelector("#reset");

let ready = false;
let t0 = 0;
let timerId = null;

function reset(){
  clearTimeout(timerId);
  timerId = null;
  ready = false;
  t0 = 0;
  msg.textContent = "start 누르기";
  msEl.textContent = "-";
  tapBtn.disabled = true;
}

startBtn.addEventListener("click", () => {
  reset();
  msg.textContent = "wait...";
  const delay = 1000 + Math.floor(Math.random() * 2000);

  timerId = setTimeout(() => {
    ready = true;
    t0 = performance.now();
    msg.textContent = "NOW!";
    tapBtn.disabled = false;
  }, delay);
});

tapBtn.addEventListener("click", () => {
  if (!ready) return;
  const t1 = performance.now();
  const diff = Math.round(t1 - t0);
  msEl.textContent = diff;
  msg.textContent = "done";
  ready = false;
  tapBtn.disabled = true;
});

resetBtn.addEventListener("click", reset);

reset();
