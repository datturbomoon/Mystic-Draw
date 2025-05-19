const deck = document.getElementById("deck");
const shuffleBtn = document.getElementById("shuffleBtn");
let flipCount = 0;

// All 22 Major Arcana card paths
const cardImages = [
  "Cards/00-TheFool.jpg",
  "Cards/01-TheMagician.jpg",
  "Cards/02-TheHighPriestess.jpg",
  "Cards/03-TheEmpress.jpg",
  "Cards/04-TheEmperor.jpg",
  "Cards/05-TheHierophant.jpg",
  "Cards/06-TheLovers.jpg",
  "Cards/07-TheChariot.jpg",
  "Cards/08-Strength.jpg",
  "Cards/09-TheHermit.jpg",
  "Cards/10-WheelOfFortune.jpg",
  "Cards/11-Justice.jpg",
  "Cards/12-TheHangedMan.jpg",
  "Cards/13-Death.jpg",
  "Cards/14-Temperance.jpg",
  "Cards/15-TheDevil.jpg",
  "Cards/16-TheTower.jpg",
  "Cards/17-TheStar.jpg",
  "Cards/18-TheMoon.jpg",
  "Cards/19-TheSun.jpg",
  "Cards/20-Judgement.jpg",
  "Cards/21-TheWorld.jpg",
];

// Shuffle the array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Render shuffled deck
function renderDeck() {
  deck.innerHTML = "";
  shuffle(cardImages);
  cardImages.forEach((imgSrc) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const isReversed = Math.random() < 0.5;

    card.innerHTML = `
    <div class="card-inner">
      <div class="card-back"></div>
      <div class="card-front ${
        isReversed ? "reversed" : ""
      }" style="background-image: url('${imgSrc}')"></div>
    </div>
  `;

    card.addEventListener("click", () => {
      // If already flipped, just open modal again
      if (card.classList.contains("flipped")) {
        const cardFront = card.querySelector(".card-front");
        const imgSrc = cardFront.style.backgroundImage.slice(5, -2); // extract URL
        const isReversed = cardFront.classList.contains("reversed");
        openModal(imgSrc, isReversed);
        return;
      }

      // First time flip
      card.classList.add("flipped");
      flipCount++;

      // Add number to the front of the card
      const label = document.createElement("span");
      label.classList.add("card-number");
      label.textContent = flipCount;
      // If this is the 3rd card, add upper-left class
      if (flipCount === 3) {
        label.classList.add("upper-left");
      }

      const cardFront = card.querySelector(".card-front");
      cardFront.appendChild(label);

      const imgSrc = cardFront.style.backgroundImage.slice(5, -2);
      const isReversed = cardFront.classList.contains("reversed");

      setTimeout(() => openModal(imgSrc, isReversed), 500);
    });

    deck.appendChild(card);
  });
}

// Initial render
renderDeck();

// Draw a random card on button click
const drawRandomBtn = document.getElementById("drawRandomBtn");

drawRandomBtn.addEventListener("click", () => {
  const allCards = document.querySelectorAll(".card:not(.flipped)");
  if (allCards.length === 0) return;

  const randomIndex = Math.floor(Math.random() * allCards.length);
  const selectedCard = allCards[randomIndex];

  selectedCard.click(); // triggers existing click logic
});

// Reshuffle on button click
shuffleBtn.addEventListener("click", () => {
  flipCount = 0; // ✅ Reset count here

  renderDeck(); // Refresh and re-render cards face down

  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const cardInner = card.querySelector(".card-inner");

    // Add blur before animation
    cardInner.classList.add("blur", "glow");

    // Set animation transform values
    const tx = (Math.random() - 0.5) * 300 + "px";
    const ty = (Math.random() - 0.5) * 200 + "px";
    const r = (Math.random() - 0.5) * 60 + "deg";

    cardInner.style.setProperty("--tx", tx);
    cardInner.style.setProperty("--ty", ty);
    cardInner.style.setProperty("--r", r);

    cardInner.classList.add("scatter-animation");
  });

  // Regroup after scatter
  setTimeout(() => {
    cards.forEach((card) => {
      const cardInner = card.querySelector(".card-inner");
      cardInner.classList.remove("scatter-animation");
      cardInner.classList.add("regroup-animation");
    });

    // After regroup ends, clean up
    setTimeout(() => {
      cards.forEach((card) => {
        const cardInner = card.querySelector(".card-inner");
        cardInner.classList.remove("regroup-animation");
        cardInner.classList.remove("blur", "glow");

        cardInner.style.removeProperty("--tx");
        cardInner.style.removeProperty("--ty");
        cardInner.style.removeProperty("--r");
      });
    }, 800);
  }, 800);
});

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-image");
const closeBtn = document.querySelector(".close-button");

function openModal(imgSrc, rotation = "rotate(0deg)") {
  modalImg.src = imgSrc;
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open"); // Hide footer

  // Apply rotation to modal
  modalImg.style.transform = `${rotation} scale(1)`;
  modalImg.classList.remove("animate");
  void modalImg.offsetWidth;
  modalImg.classList.add("animate");
}

function closeModal() {
  modal.classList.add("hidden");
  modalImg.src = "";
  document.body.classList.remove("modal-open"); // Show footer
}

// Click outside or on button to close
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target === closeBtn) {
    closeModal();
  }
});

// PARTICLES

particlesJS("particles-js", {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#d4c7f7",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.6,
      random: true,
    },
    size: {
      value: 3,
      random: true,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      out_mode: "out",
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: false,
      },
      onclick: {
        enable: false,
      },
    },
  },
  retina_detect: true,
});
