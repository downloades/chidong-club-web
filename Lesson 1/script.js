const countEl = document.querySelector("#count");
const plusBtn = document.querySelector("#plus");
const resetBtn = document.querySelector("#reset");

let count = 0;

plusBtn.addEventListener("click", () => {
  count += 1;
  countEl.textContent = count;
});

resetBtn.addEventListener("click", () => {
  count = 0;
  countEl.textContent = count;
});
