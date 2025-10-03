// --- PHASE JOUEUR 1 : création des 10 prénoms ---
const inputsDiv = document.getElementById("inputs");
for (let i = 0; i < 10; i++) {
    const inp = document.createElement("input");
    inp.placeholder = "Prénom " + (i + 1);
    inputsDiv.appendChild(inp);
}

document.getElementById("validate").onclick = () => {
    const names1 = [...inputsDiv.querySelectorAll("input")]
                    .map(x => x.value.trim())
                    .filter(Boolean);
    if (names1.length !== 10) return alert("Mets bien 10 prénoms !");
    const url = window.location.origin + window.location.pathname + "?p1=" + encodeURIComponent(names1.join(","));
    document.getElementById("shareLink").innerHTML = `
        Envoie ce lien à ton ami :<br>
        <a href="${url}">${url}</a>
    `;
};

// --- PHASE JOUEUR 2 : remplir ses 10 prénoms ---
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
        const names2 = [...inputsDiv2.querySelectorAll("input")]
                        .map(x => x.value.trim())
                        .filter(Boolean);
        if (names2.length !== 10) return alert("Mets bien 10 prénoms !");
        const names1 = params.get("p1").split(",");
        const finalUrl1 = window.location.origin + window.location.pathname +
                          "?p1=" + encodeURIComponent(names1.join(",")) +
                          "&p2=" + encodeURIComponent(names2.join(",")) +
                          "&me=1";
        const finalUrl2 = window.location.origin + window.location.pathname +
                          "?p1=" + encodeURIComponent(names1.join(",")) +
                          "&p2=" + encodeURIComponent(names2.join(",")) +
                          "&me=2";
        document.getElementById("addSecond").innerHTML = `
            Lien pour Joueur 1 : <a href="${finalUrl1}">${finalUrl1}</a><br>
            Lien pour Joueur 2 : <a href="${finalUrl2}">${finalUrl2}</a><br>
            Chacun ouvre son lien pour commencer le jeu !
        `;
    };
}

// --- PHASE JEU : lien final avec p1 et p2 ---
if (params.has("p1") && params.has("p2")) {
    document.getElementById("setup").style.display = "none";
    document.getElementById("addSecond").style.display = "none";
    document.getElementById("game").style.display = "block";

    const names1 = params.get("p1").split(",");
    const names2 = params.get("p2").split(",");
    const allNames = [...names1, ...names2];

    let currentPlayer, target;

    if (params.get("me") === "1") {
        currentPlayer = "Joueur 1";
        // Joueur 1 fait DEVINER un prénom de son propre lot
        target = names1[Math.floor(Math.random() * names1.length)];
    } else if (params.get("me") === "2") {
        currentPlayer = "Joueur 2";
        // Joueur 2 fait DEVINER un prénom de son propre lot
        target = names2[Math.floor(Math.random() * names2.length)];
    } else {
        alert("Lien invalide : ajoutez &me=1 ou &me=2 à l'URL");
        throw new Error("Paramètre me manquant");
    }

    document.getElementById("targetName").innerText = `${currentPlayer} : Prénom à faire deviner : ${target}`;

    // Créer la grille complète
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
                heartsDiv.innerText = "❤️";
                alert("Mauvais choix ! Il te reste 1 vie.");
            } else {
                heartsDiv.innerText = "💔";
                document.getElementById("result").innerText = "❌ Perdu ! Plus de vies.";
            }
        }
    };
}
