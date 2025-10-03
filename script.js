// Générer 10 inputs
const inputsDiv = document.getElementById("inputs");
for (let i = 0; i < 10; i++) {
  const inp = document.createElement("input");
  inp.placeholder = "Prénom " + (i + 1);
  inputsDiv.appendChild(inp);
}

// Valider joueur 1
document.getElementById("validate").onclick = () => {
  const names = [...inputsDiv.querySelectorAll("input")].map(x => x.value.trim()).filter(Boolean);
  if (names.length < 10) {
    alert("Mets bien 10 prénoms !");
    return;
  }
  // Créer un lien avec les prénoms de joueur1
  const url = window.location.origin + window.location.pathname + "?p1=" + encodeURIComponent(names.join(","));
  document.getElementById("shareLink").innerHTML = "Envoie ce lien à ton ami :<br><a href='" + url + "'>" + url + "</a>";
};

// Si l’URL contient les prénoms joueur1
const params = new URLSearchParams(window.location.search);
if (params.has("p1")) {
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
    if (names2.length < 10) {
      alert("Mets bien 10 prénoms !");
      return;
    }
    const names1 = params.get("p1").split(",");
    startGame([...names1, ...names2]);
  };
}

// Lancer le jeu
function startGame(allNames) {
  document.getElementById("addSecond").style.display = "none";
  document.getElementById("game").style.display = "block";

  // Tirer au sort une cible pour chaque joueur
  const shuffled = allNames.sort(() => Math.random() - 0.5);
  const player1Target = shuffled[Math.floor(Math.random() * shuffled.length)];
  const player2Target = shuffled[Math.floor(Math.random() * shuffled.length)];

  console.log("Cible joueur1:", player1Target);
  console.log("Cible joueur2:", player2Target);

  // Créer la grille
  const grid = document.getElementById("grid");
  shuffled.forEach(name => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = name;
    card.onclick = () => card.classList.toggle("removed");
    grid.appendChild(card);
  });

  // Vies
  let lives = 2;

  document.getElementById("guess").onclick = () => {
    const guess = prompt("Entre le prénom que tu devines :");
    if (!guess) return;
    if (guess === player1Target || guess === player2Target) {
      document.getElementById("result").innerText = "🎉 Bravo ! Bonne réponse.";
    } else {
      lives--;
      if (lives > 0) {
        document.getElementById("hearts").innerText = "❤️🧡";
        alert("Mauvais choix ! Il te reste 1 vie.");
      } else {
        document.getElementById("hearts").innerText = "💔";
        document.getElementById("result").innerText = "❌ Perdu ! Plus de vies.";
      }
    }
  };
}
