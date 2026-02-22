const btnTheme = document.querySelector("#btnTheme");
const btnPick = document.querySelector("#btnPick");
const pickEl = document.querySelector("#pick");

// 다크모드 토글
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  btnTheme.textContent = isDark ? "☀️ 라이트모드" : "🌙 다크모드";
});

// 랜덤 추천
const items = [
  "오늘의 벌칙: 팔굽혀펴기 10개",
  "오늘의 미션: 팀원 1명 칭찬하기",
  "오늘의 추천: 간식 먹기 🍪",
  "오늘의 추천: 노래 한 곡 듣기 🎧",
  "오늘의 미션: 5분 정리정돈"
];

btnPick.addEventListener("click", () => {
  const idx = Math.floor(Math.random() * items.length);
  pickEl.textContent = items[idx];
});
