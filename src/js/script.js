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
            if (picBoss.src == lienBoss + $boss) {
              //Je creer une boucle pour générer aléatoirement mes cartes
              for (let i = 0; i < 4; i++) {
                var card = document.createElement("img");
                var lienCard = "http://localhost:1234/assets/cards/";
                card.classList.add("game__card");
                card.src = lienCard + cards[getRandomInt(8)];
                divCards.appendChild(card);
              }
              let cardMickey = lienCard + $card;
              card.src = cardMickey;
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
                  if (cardElement.src === lienCard + $card) {
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
            "cailloux.png",
            "communisme.png",
            "desintox.png",
            "fakenews.png",
            "judas.png",
            "piege-souris.png",
            "the.png",
            "vetement.png"
          ];

          let divBoss = document.querySelector(".game__picture");
          let nameBoss = [
            "snoop.png",
            "mickey.png",
            "jesus.png",
            "elon.png",
            "panda.png"
          ];
          //Je crée un effet de drag and drop (dropper et css a modifié)
          (function() {
            let dndHandler = {
              draggedElement: null,
              applyDragEvents:function(element) {
                element.game_cards = true;
                let dndHandler = this;
                element.addEventListener('dragstart', function(e) {
                  dndHandler.draggedElement = e.target
                  e.dataTransfer.setData('text/plain', '');
                })
              },
              applyDropEvents: function(dropper) {
                dropper.addEventListener('onclick', function(e) {
                  e.preventDefault();
                  this.className = 'dropper game_cards';
                });
                dropper.addEventListener('dragleave', function() {
                  this.className = 'game_cards';
                });
                dropper.addEventListener('drop', function(e){
                  let target = e.target;
                  draggedElement = dndHandler.draggedElement
                  clonedElement = draggedElement.cloneNode(true);
                  
                  target.className = 'game_cards';
                  clonedElement = target.appendChild(clonedEelement);
                  dndHandler.applyDragEvents(clonedElement);
                  draggedElement.parentNode.removeChild(draggedElement)
                  let elements = document.querySelectorAll('.game_cards');
                  let elementsLen = elements.length;
                  for (let i = 0 ; i < elementsLen; i++) {
                    dndHandler.applyDragEvents(elements[i]);
                  };
                  let droppers = document.querySelectorAll('.game_boss');
                  let droppersLen = droppers.length;
                  for (let i =  0   ; i < droppersLen ; i++) {
                    dndHandler.applyDragEvents(droppers[i]);
                  };
                })
              }
            }
            });
          
          
          
          
          
          //Je creer une variable aléatoire pour générer aléatoirement un boss
          var boss = document.createElement("img");
          var lienBoss = "http://localhost:1234/assets/boss/";
          boss.classList.add("game__boss");
          boss.src = lienBoss + nameBoss[getRandomInt(5)];
          divBoss.appendChild(boss);

          let picBoss = document.querySelector(".game__boss");
          bossCondition("mickey.png", "piege-souris.png");
          bossCondition("snoop.png", "desintox.png");
          bossCondition("jesus.png", "judas.png");
          bossCondition("panda.png", "the.png");
          bossCondition("elon.png", "cailloux.png");
        });
      });
    });
  });
});
