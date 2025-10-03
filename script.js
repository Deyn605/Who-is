// --- GÉNÉRATION DES INPUTS JOUEUR 1 ---
const inputsDiv = document.getElementById("inputs");
for (let i = 0; i < 10; i++) {
  const inp = document.createElement("input");
  inp.placeholder = "Prénom " + (i + 1);
  inputsDiv.appendChild(inp);
}

// --- VALIDATION JOUEUR 1 ---
document.getElementById("validate").onclick = () => {
  const names1 = [...inputsDiv.querySelectorAll("input")].map(x => x.value.trim()).filter(Boolean);
  if (names1.length !== 10) return alert("Mets bien 10 prénoms !");

  const url = window.location.origin + window.location.pathname + "?p1=" + encodeURIComponent(names1.join(","));
  document.getElementById("shareLink").innerHTML = `
    Envoie ce lien à ton ami :<br><a href="${url}">${url}</a>
  `;
};

// --- SI URL CONTIENT p1 SEUL (joueur 2) ---
const params = new URLSearchParams(window.location.search);
if (params.has("p1") && !params.has("p2")) {
  document.getElementById("setup").style.display = "none";
  document.getElementById("addSecond").style.display = "block";

  const inputsDiv2 = document.getElementById("inputs2");
  for (let i = 0; i < 10; i++) {
    const inp = document.createElement("input");
    inp.placeholder = "Prénom " + (i + 1);
    inputsDiv2.appendChild(inp);
  }

  document.getElementById("validate2").onclick = () => {
    const names2 = [...inputsDiv2.querySelectorAll("input")].map(x => x.value.trim()).filter(Boolean);
    if (names2.length !== 10) return alert("Mets bien 10 prénoms !");

    const names1 = params.get("p1").split(",");
    const finalUrl = window.location.origin + window.location.pathname + 
                     "?p1=" + encodeURIComponent(names1.join(",")) +
                     "&p2=" + encodeURIComponent(names2.join(","));
    document.getElementById("addSecond").innerHTML = `
      Lien final créé ! Envoie-le à joueur 1 pour commencer le jeu :<br>
      <a href="${finalUrl}">${finalUrl}</a>
    `;
  };
}

// --- SI URL CONTIENT p1 ET p2 (lien final) ---
if (params.has("p1") && params.has("p2")) {
  document.getElementById("setup").style.display = "none";
  document.getElementById("addSecond").style.display = "none";
  document.getElementById("game").style.display = "block";

  const names1 = params.get("p1").split(",");
  const names2 = params.get("p2").split(",");
  const allNames = [...names1, ...names2];

  // Tirer au sort : joueur 1 devine un prénom joueur 2, joueur 2 devine un prénom joueur 1
  // Déterminer qui est le joueur actuel selon l'ordre URL (simplification)
  let currentPlayer, target;
  if (!params.has("me")) {
    // Joueur 1 ouvre le lien final
    currentPlayer = "Joueur 1";
    target = names2[Math.floor(Math.random() * names2.length)];
  } else {
    // Joueur 2 ouvre le lien final (optionnel si on veut passer un paramètre me=2)
    currentPlayer = "Joueur 2";
    target = names1[Math.floor(Math.random() * names1.length)];
  }

  document.getElementById("targetName").innerText = `${currentPlayer} : Prénom à faire deviner : ${target}`;

  // Créer la grille
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  allNames.forEach(name => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = name;
    card.onclick = () => card.classList.toggle("removed");
    grid.appendChild(card);
  });

  // Vies
  let lives = 2;
  const heartsDiv = document.getElementById("hearts");

  document.getElementById("guess").onclick = () => {
    const guess = prompt("Entre le prénom que tu devines :");
    if (!guess) return;
    if (guess === target) {
      document.getElementById("result").innerText = "🎉 Bravo ! Bonne réponse.";
      heartsDiv.innerText = "❤️❤️";
    } else {
      lives--;
      if (lives > 0) {
        heartsDiv.innerText = "❤️🧡";
        alert("Mauvais choix ! Il te reste 1 vie.");
      } else {
        heartsDiv.innerText = "💔";
        document.getElementById("result").innerText = "❌ Perdu ! Plus de vies.";
      }
    }
  };
}
