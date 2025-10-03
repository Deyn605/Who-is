// Générer 10 inputs pour le joueur 1
const inputsDiv = document.getElementById("inputs");
for (let i = 0; i < 10; i++) {
  const inp = document.createElement("input");
  inp.placeholder = "Prénom " + (i + 1);
  inputsDiv.appendChild(inp);
}

// Valider joueur 1
document.getElementById("validate").onclick = () => {
  const names = [...inputsDiv.querySelectorAll("input")].map(x => x.value.trim()).filter(Boolean);
  if (names.length !== 10) return alert("Mets bien 10 prénoms !");

  // Afficher le lien pour joueur 2
  const url = window.location.origin + window.location.pathname + "?p1=" + encodeURIComponent(names.join(","));
  document.getElementById("shareLink").innerHTML = `
    Envoie ce lien à ton ami :<br><a href="${url}">${url}</a><br><br>
    <button id="startSolo">Lancer le jeu maintenant</button>
  `;

  // Joueur 1 peut lancer le jeu seul
  document.getElementById("startSolo").onclick = () => {
    startGame(names, "Joueur 1");
  };
};

// Si URL contient les prénoms joueur 1 (pour joueur 2)
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
    if (names2.length !== 10) return alert("Mets bien 10 prénoms !");
    
    const names1 = params.get("p1").split(",");
    startGame([...names1, ...names2], "Joueur 2");
  };
}

// Fonction pour lancer le jeu
function startGame(allNames, currentPlayer) {
  document.getElementById("setup").style.display = "none";
  document.getElementById("addSecond").style.display = "none";
  document.getElementById("game").style.display = "block";

  // Mélanger les prénoms
  const shuffled = allNames.sort(() => Math.random() - 0.5);

  // Choisir un prénom à deviner
  const target = shuffled[Math.floor(Math.random() * shuffled.length)];
  document.getElementById("targetName").innerText = `${currentPlayer} : Prénom à faire deviner : ${target}`;

  // Créer la grille
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  shuffled.forEach(name => {
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
