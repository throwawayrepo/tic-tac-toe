"use strict";

const container = document.querySelector(".container");
const modal = document.querySelector(".modal");
const newGame = document.querySelector(".new-game-container");
const turnImg = document.querySelector(".turn-img");
const markToggle = document.querySelector(".mark-toggle");

const turnXSrc = "img/icon-x-gray.svg";
const turnOSrc = "img/icon-o-gray.svg";

class AppCPU {
  #boardState;
  #counter;
  #turn = true;
  #victoryFlag = false;
  #mark;
  #scores = { x: 0, tie: 0, o: 0 };

  constructor(selectedMark) {
    this.#mark = selectedMark;
    this.#init();
    container.addEventListener(
      "click",
      function (e) {
        if (e.target.classList.contains("square")) this.#acceptInput(e.target);
        if (e.target.classList.contains("restart-btn")) this.#init();
      }.bind(this)
    );

    modal.addEventListener(
      "click",
      function (e) {
        if (e.target.classList.contains("next-btn")) {
          this.#init();
          this.#toggleModal();
        }
        if (e.target.classList.contains("quit-btn")) this.#toggleModal();
      }.bind(this)
    );
  }

  #init() {
    this.#boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    this.#counter = 0;

    if (this.#mark === "x") {
      this.#turn = true;
    } else {
      document.querySelector(".score-x .score-text").innerHTML = "X (CPU)";
      document.querySelector(".score-o .score-text").innerHTML = "O (You)";
      this.#turn = false;
      const delay = (Math.random() * 1.5).toFixed(3);
      setTimeout(() => this.#cpuInput(), delay * 1000);
    }

    this.#victoryFlag = false;

    document
      .querySelectorAll(".square")
      .forEach((square) => (square.innerHTML = ""));
  }

  #toggleModal() {
    document.querySelector(".modal").classList.toggle("hidden");
    document.querySelector(".overlay").classList.toggle("hidden");
  }

  #acceptInput(square) {
    if (
      this.#turn &&
      !this.#victoryFlag &&
      this.#boardState[square.dataset.row][square.dataset.column].valueOf() ===
        ""
    ) {
      this.#boardState[square.dataset.row][square.dataset.column] = `${
        this.#mark
      }`;
      square.innerHTML = `<img src="img/icon-${this.#mark}.svg" alt="" />`;
      this.#counter++;
      this.#turn = !this.#turn;
      this.#checkWin(`${this.#mark}`);
      if (this.#mark.valueOf() === "x") {
        turnImg.src = turnOSrc;
      } else {
        turnImg.src = turnXSrc;
      }
      const delay = (Math.random() * 1.5).toFixed(3);
      setTimeout(() => this.#cpuInput(), delay * 1000);
    }
  }

  #cpuInput() {
    let row, column;
    const cpuMark = this.#mark.valueOf() === "o" ? "x" : "o";
    if (!this.#turn && this.#counter < 9 && !this.#victoryFlag) {
      do {
        row = Math.trunc(Math.random() * 3);
        column = Math.trunc(Math.random() * 3);
      } while (this.#boardState[row][column].valueOf() !== "");
      this.#boardState[row][column] = `${cpuMark}`;
      this.#counter++;
      document.querySelector(
        `[data-row="${row}"][data-column="${column}"]`
      ).innerHTML = `<img src="img/icon-${cpuMark}.svg" alt="" />`;
      this.#turn = !this.#turn;
      if (this.#mark.valueOf() === "x") {
        turnImg.src = turnXSrc;
      } else {
        turnImg.src = turnOSrc;
      }
      this.#checkWin(`${cpuMark}`);
    }
  }

  #checkWin(player) {
    function check(var1, var2, var3, var4 = 0, var5 = 1, var6 = 2) {
      if (
        this.#boardState[var4][var1].valueOf() !== "" &&
        this.#boardState[var4][var1].valueOf() ===
          this.#boardState[var5][var2].valueOf() &&
        this.#boardState[var4][var1].valueOf() ===
          this.#boardState[var6][var3].valueOf()
      ) {
        this.#scores[player]++;

        this.#victoryFlag = true;
        this.#updateScoreboard();
        this.#showWinner(player);
      }
    }

    for (let i = 0; i < 3; i++) {
      check.bind(this, 0, 1, 2, i, i, i)();

      check.bind(this, i, i, i)();
    }
    check.bind(this, 0, 1, 2)();
    check.bind(this, 2, 1, 0)();
    if (!this.#victoryFlag && this.#counter === 9) {
      this.#scores.tie++;
      this.#showWinner();
    }
    this.#updateScoreboard();
  }

  #updateScoreboard() {
    for (const element in this.#scores) {
      document.querySelector(`.score-value-${element}`).innerHTML =
        this.#scores[element];
    }
  }

  #showWinner(winner = "tie") {
    const text = document.querySelector(".text-winner");
    text.innerHTML = `It's a tie`;
    if (winner !== "tie")
      text.innerHTML = `<img src="img/icon-${winner}.svg" alt="" /> takes the round`;
    let announcement = text.previousElementSibling;
    if (winner === "x") {
      text.style.color = "#31c3bd";
      this.#mark === "x"
        ? (announcement.innerHTML = "You won!")
        : (announcement.innerHTML = "You lost...");
    } else if (winner === "o") {
      text.style.color = "#f2b137";
      this.#mark === "o"
        ? (announcement.innerHTML = "You won!")
        : (announcement.innerHTML = "You lost...");
    } else {
      text.style.color = "#31c3bd";
      announcement.innerHTML = `Awh...`;
    }
    this.#toggleModal();
  }
}

class AppPlayer {
  #boardState;
  #counter;
  #turn = true;
  #victoryFlag = false;
  #mark = "x";
  #mark2 = "o";
  #scores = { x: 0, tie: 0, o: 0 };

  constructor() {
    this.#init();
    container.addEventListener(
      "click",
      function (e) {
        if (e.target.classList.contains("square")) this.#acceptInput(e.target);
        if (e.target.classList.contains("restart-btn")) this.#init();
      }.bind(this)
    );

    modal.addEventListener(
      "click",
      function (e) {
        if (e.target.classList.contains("next-btn")) {
          this.#init();
          this.#toggleModal();
        }
        if (e.target.classList.contains("quit-btn")) this.#toggleModal();
      }.bind(this)
    );
  }

  #init() {
    this.#boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    this.#counter = 0;

    this.#turn = true;

    document.querySelector(".score-x .score-text").innerHTML = `X (P1)`;
    document.querySelector(".score-o .score-text").innerHTML = `O (P2)`;

    this.#victoryFlag = false;

    document
      .querySelectorAll(".square")
      .forEach((square) => (square.innerHTML = ""));
  }

  #toggleModal() {
    document.querySelector(".modal").classList.toggle("hidden");
    document.querySelector(".overlay").classList.toggle("hidden");
  }

  #acceptInput(square) {
    if (
      this.#turn &&
      !this.#victoryFlag &&
      this.#boardState[square.dataset.row][square.dataset.column].valueOf() ===
        ""
    ) {
      this.#boardState[square.dataset.row][square.dataset.column] = `${
        this.#mark
      }`;
      square.innerHTML = `<img src="img/icon-${this.#mark}.svg" alt="" />`;
      this.#counter++;
      this.#turn = !this.#turn;
      this.#checkWin(`${this.#mark}`);
      if (this.#mark.valueOf() === "x") {
        turnImg.src = turnOSrc;
      } else {
        turnImg.src = turnXSrc;
      }
    }
    if (
      !this.#turn &&
      !this.#victoryFlag &&
      this.#boardState[square.dataset.row][square.dataset.column].valueOf() ===
        ""
    ) {
      this.#boardState[square.dataset.row][square.dataset.column] = `${
        this.#mark2
      }`;
      square.innerHTML = `<img src="img/icon-${this.#mark2}.svg" alt="" />`;
      this.#counter++;
      this.#turn = !this.#turn;
      this.#checkWin(`${this.#mark2}`);
      if (this.#mark2.valueOf() === "x") {
        turnImg.src = turnOSrc;
      } else {
        turnImg.src = turnXSrc;
      }
    }
  }

  #checkWin(player) {
    function check(var1, var2, var3, var4 = 0, var5 = 1, var6 = 2) {
      if (
        this.#boardState[var4][var1].valueOf() !== "" &&
        this.#boardState[var4][var1].valueOf() ===
          this.#boardState[var5][var2].valueOf() &&
        this.#boardState[var4][var1].valueOf() ===
          this.#boardState[var6][var3].valueOf()
      ) {
        this.#scores[player]++;

        this.#victoryFlag = true;
        this.#updateScoreboard();
        this.#showWinner(player);
      }
    }

    for (let i = 0; i < 3; i++) {
      check.bind(this, 0, 1, 2, i, i, i)();

      check.bind(this, i, i, i)();
    }
    check.bind(this, 0, 1, 2)();
    check.bind(this, 2, 1, 0)();
    if (!this.#victoryFlag && this.#counter === 9) {
      this.#scores.tie++;
      this.#showWinner();
    }
    this.#updateScoreboard();
  }

  #updateScoreboard() {
    for (const element in this.#scores) {
      document.querySelector(`.score-value-${element}`).innerHTML =
        this.#scores[element];
    }
  }

  #showWinner(winner = "tie") {
    const text = document.querySelector(".text-winner");
    text.innerHTML = `It's a tie`;
    if (winner !== "tie")
      text.innerHTML = `<img src="img/icon-${winner}.svg" alt="" /> takes the round`;
    let announcement = text.previousElementSibling;
    if (winner === "x") {
      text.style.color = "#31c3bd";
      this.#mark === "x"
        ? (announcement.innerHTML = "Player 1 won!")
        : (announcement.innerHTML = "Player 2 won!");
    } else if (winner === "o") {
      text.style.color = "#f2b137";
      this.#mark === "o"
        ? (announcement.innerHTML = "Player 1 won!")
        : (announcement.innerHTML = "Player 2 won!");
    } else {
      text.style.color = "#31c3bd";
      announcement.innerHTML = `Awh...`;
    }
    this.#toggleModal();
  }
}

class NewGame {
  #mark = "x";
  constructor() {
    newGame.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        if (e.target.classList.contains("cpu-btn")) {
          new AppCPU(this.#mark);
          document
            .querySelector(".new-game-overlay")
            .classList.toggle("hidden");
        }
        if (e.target.classList.contains("player-btn")) {
          new AppPlayer(this.#mark);
          document
            .querySelector(".new-game-overlay")
            .classList.toggle("hidden");
        }

        if (e.target.closest(".mark-toggle")) this.#toggleRadio(e);
      }.bind(this)
    );
  }

  #toggleRadio(e) {
    let unchecked;
    if (e.target.parentNode.querySelector(".mark")) {
      markToggle.querySelectorAll(".mark").forEach((element) => {
        if (!element.checked) unchecked = element;
      });
      unchecked.checked = !unchecked.checked;
      this.#changeSelection(unchecked.value);
    }
  }

  #changeSelection = function (selection) {
    document
      .querySelectorAll(".mark-icon")
      .forEach((element) => element.classList.toggle("selected"));
    this.#mark = selection;
  };
}

new NewGame();
