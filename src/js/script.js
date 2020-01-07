oxo.screens.loadScreen("home", function() {
  let play = document.querySelector(".home__playIcon");
  play.addEventListener("click", function() {
    oxo.screens.loadScreen("transition", function() {
      let next = document.querySelector(".transition__next");
      next.addEventListener("click", function() {
        oxo.screens.loadScreen("game", function() {});
      });
    });
  });
});
