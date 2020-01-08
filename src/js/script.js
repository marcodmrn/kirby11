oxo.screens.loadScreen("home", function() {
  //Je sélectionne mon élément et le place dans une variable
  let play = document.querySelector(".home__playIcon");
  //J'écoute le click sur mon élément
  play.addEventListener("click", function() {
    //Je charge le screen "transition"
    oxo.screens.loadScreen("transition", function() {
      //Je sélectionne mon élément et le place dans une variable
      let next = document.querySelector(".transition__next");
      //J'écoute le click sur mon élément
      next.addEventListener("click", function() {
        //Je charge le screen "game"
        oxo.screens.loadScreen("game", function() {
          //Fonction pour avoir un nombre aléatoire entre 0 et le max - 1
          function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
          }
          function bossCondition($boss, $card) {
            if (picBoss.className == "game__boss game__boss--" + $boss) {
              //Je creer une boucle pour générer aléatoirement mes cartes
              for (let i = 0; i < 3; i++) {
                var card = document.createElement("div");
                card.classList.add("game__card", cards[getRandomInt(8)]);
                divCards.appendChild(card);
              }
              var card = document.createElement("div");
              card.classList.add("game__card", "game__card--" + $card);
              divCards.appendChild(card);
              let counterLifeBoss = 0;
              let counterLifeYou = 0;
              let cardsDeck = document.querySelectorAll(".game__card");
              cardsDeck.forEach(cardElement => {
                cardElement.addEventListener("click", function() {
                  let divHeartBoss = document.querySelector(
                    ".game__hearts--boss"
                  );
                  let heartBoss = document.querySelector(
                    ".game__hearts--boss .game__heart"
                  );
                  let divHeartYou = document.querySelector(
                    ".game__hearts--you"
                  );
                  let heartYou = document.querySelector(
                    ".game__hearts--you .game__heart"
                  );
                  if (
                    cardElement.className ==
                    "game__card game__card--" + $card
                  ) {
                    divHeartBoss.removeChild(heartBoss);
                    counterLifeBoss++;
                    if (counterLifeBoss === 3) {
                      oxo.screens.loadScreen("endWin", function() {});
                    }
                  } else {
                    divHeartYou.removeChild(heartYou);
                    counterLifeYou++;
                    if (counterLifeYou === 3) {
                      oxo.screens.loadScreen("endLoose", function() {});
                    }
                  }
                });
              });
            }
          }

          let divCards = document.querySelector(".game__cards");
          let cards = [
            "game__card--cailloux",
            "game__card--communisme",
            "game__card--desintox",
            "game__card--fakenews",
            "game__card--judas",
            "game__card--piegeSouris",
            "game__card--the",
            "game__card--vetement"
          ];

          let divBoss = document.querySelector(".game__picture");
          let nameBoss = [
            "game__boss--snoop",
            "game__boss--mickey",
            "game__boss--jesus",
            "game__boss--elon",
            "game__boss--panda"
          ];

          //Je creer une variable aléatoire pour générer aléatoirement un boss
          var boss = document.createElement("div");
          boss.classList.add("game__boss", nameBoss[getRandomInt(5)]);
          divBoss.appendChild(boss);

          let picBoss = document.querySelector(".game__boss");
          bossCondition("mickey", "piegeSouris");
          bossCondition("snoop", "desintox");
          bossCondition("jesus", "judas");
          bossCondition("panda", "the");
          bossCondition("elon", "cailloux");
        });
      });
    });
  });
});
