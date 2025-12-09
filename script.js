const gameArea = document.getElementById("gameArea");
const menu = document.getElementById("menu");
const hud = document.getElementById("hud");

const roundEl = document.getElementById("round");
const hitsEl = document.getElementById("hits");
const missesEl = document.getElementById("misses");
const reactionEl = document.getElementById("reaction");

let mode = "practice";
let active = false;
let hits = 0;
let misses = 0;
let rounds = 0;
const testRounds = 3;
let reactionTimes = [];
let waitingForClick = false;
let reactionStart = 0;
let colorTimeout = null;

function startGame(selectedMode) {
  mode = selectedMode;
  menu.classList.add("hidden");
  hud.classList.remove("hidden");

  hits = 0;
  misses = 0;
  rounds = 0;
  reactionTimes = [];
  roundEl.textContent = rounds;
  hitsEl.textContent = hits;
  missesEl.textContent = misses;
  reactionEl.textContent = 0;

  active = true;
  nextColorChange();
}

function nextColorChange() {
  if (!active) return;

  waitingForClick = false;
  gameArea.style.backgroundColor = "#111";

  // Random delay 1–3 seconds before green
  const delay = Math.random() * 2000 + 1000;
  colorTimeout = setTimeout(() => {
    if (!active) return;
    gameArea.style.backgroundColor = "green";
    reactionStart = Date.now();
    waitingForClick = true;
  }, delay);
}

gameArea.addEventListener("click", () => {
  if (!active) return;

  if (waitingForClick) {
    const reactionTime = Date.now() - reactionStart;
    hits++;
    reactionEl.textContent = reactionTime;
    if (mode === "test") reactionTimes.push(reactionTime);
    waitingForClick = false;

    if (mode === "test") {
      rounds++;
      roundEl.textContent = rounds;
      if (rounds >= testRounds) {
        endGame();
        return;
      }
    }
  } else {
    misses++;
  }

  hitsEl.textContent = hits;
  missesEl.textContent = misses;
  nextColorChange();
});

function endGame() {
  active = false;
  clearTimeout(colorTimeout);
  gameArea.style.backgroundColor = "#111";
  hud.classList.add("hidden");
  menu.classList.remove("hidden");

  if (mode === "test" && reactionTimes.length > 0) {
    const avg = Math.round(
      reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
    );
    alert(
      `Game Over!\nHits: ${hits}\nMisses: ${misses}\nAverage Reaction Time: ${avg} ms`
    );
  } else {
    alert(`Game Over!\nHits: ${hits}\nMisses: ${misses}`);
  }
}
