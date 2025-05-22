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
      // ? Play card flip sound IMMEDIATELY on any click
      const flipAudio = document.getElementById("card-flip-audio");
      if (flipAudio && soundEnabled) {
        flipAudio.volume = 0.8;
        flipAudio.currentTime = 0;
        flipAudio.play();
      }
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
  // Play shuffle sound
  const shuffleAudio = document.getElementById("shuffle-audio");
  if (shuffleAudio && soundEnabled) {
    shuffleAudio.currentTime = 0;
    shuffleAudio.play();
  }
  flipCount = 0; // ✅ Reset count here

  renderDeck(); // Refresh and re-render cards face down

  const cards = document.querySelectorAll(".card");

  cards.forEach((card, i) => {
    const cardInner = card.querySelector(".card-inner");

    // Set animation transform values
    const tx = (Math.random() - 0.5) * 120 + "px";
    const ty = (Math.random() - 0.5) * 80 + "px";
    const r = (Math.random() - 0.5) * 60 + "deg";

    cardInner.style.setProperty("--tx", tx);
    cardInner.style.setProperty("--ty", ty);
    cardInner.style.setProperty("--r", r);

    // Add a staggered delay for each card
    cardInner.style.animationDelay = `${i * 0.05}s`;
    cardInner.classList.add("scatter-animation");
  });

  // Regroup after scatter
  setTimeout(() => {
    // Play shuffle sound again for regroup
    if (shuffleAudio && soundEnabled) {
      shuffleAudio.currentTime = 0;
      shuffleAudio.play();
    }
    cards.forEach((card, i) => {
      const cardInner = card.querySelector(".card-inner");
      cardInner.classList.remove("scatter-animation");
      cardInner.classList.add("regroup-animation");
      cardInner.style.animationDelay = `${i * 0.05}s`;
    });

    // After regroup ends, clean up
    setTimeout(() => {
      cards.forEach((card) => {
        const cardInner = card.querySelector(".card-inner");
        cardInner.classList.remove("regroup-animation");
        cardInner.style.removeProperty("--tx");
        cardInner.style.removeProperty("--ty");
        cardInner.style.removeProperty("--r");
        cardInner.style.removeProperty("animationDelay");
      });
    }, 800 + cards.length * 50);
  }, 800 + cards.length * 50);
});

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-image");
const closeBtn = document.querySelector(".close-button");

// ? Card meanings data
const cardMeanings = {
  "00-TheFool.jpg": {
    name: "The Fool",
    upright: "Beginnings, innocence, spontaneity, a free spirit.",
    reversed: "Holding back, recklessness, risk-taking.",
    advice: {
      upright: "Embrace new opportunities with an open mind and heart.",
      reversed: "Pause and consider the risks before acting impulsively.",
    },
  },
  "01-TheMagician.jpg": {
    name: "The Magician",
    upright: "Manifestation, resourcefulness, power, inspired action.",
    reversed: "Manipulation, poor planning, untapped talents.",
    advice: {
      upright: "Use your skills and resources to make your vision real.",
      reversed: "Focus your energy and avoid wasting your talents.",
    },
  },
  "02-TheHighPriestess.jpg": {
    name: "The High Priestess",
    upright:
      "Intuition, sacred knowledge, divine feminine, the subconscious mind.",
    reversed: "Secrets, disconnected from intuition, withdrawal and silence.",
    advice: {
      upright: "Trust your intuition and seek inner wisdom.",
      reversed: "Reconnect with your inner voice and avoid ignoring your instincts.",
    },
  },
  "03-TheEmpress.jpg": {
    name: "The Empress",
    upright: "Femininity, beauty, nature, nurturing, abundance.",
    reversed: "Creative block, dependence on others.",
    advice: {
      upright: "Nurture yourself and others; let creativity flow.",
      reversed: "Find your own strength and break free from dependency.",
    },
  },
  "04-TheEmperor.jpg": {
    name: "The Emperor",
    upright: "Authority, establishment, structure, a father figure.",
    reversed: "Domination, excessive control, lack of discipline, inflexibility.",
    advice: {
      upright: "Establish order and take responsibility for your actions.",
      reversed: "Loosen your grip and allow flexibility in your plans.",
    },
  },
  "05-TheHierophant.jpg": {
    name: "The Hierophant",
    upright:
      "Spiritual wisdom, religious beliefs, conformity, tradition, institutions.",
    reversed: "Personal beliefs, freedom, challenging the status quo.",
    advice: {
      upright: "Seek guidance from tradition or a trusted mentor.",
      reversed: "Trust your own beliefs, even if they differ from the norm.",
    },
  },
  "06-TheLovers.jpg": {
    name: "The Lovers",
    upright:
      "Love, harmony, relationships, values alignment, choices.",
    reversed: "Self-love, disharmony, imbalance, misalignment of values.",
    advice: {
      upright: "Make choices that align with your values and heart.",
      reversed: "Focus on self-love and restoring balance in relationships.",
    },
  },
  "07-TheChariot.jpg": {
    name: "The Chariot",
    upright: "Control, willpower, success, action, determination.",
    reversed: "Self-discipline, opposition, lack of direction.",
    advice: {
      upright: "Stay focused and determined to achieve your goals.",
      reversed: "Regain your sense of direction before moving forward.",
    },
  },
  "08-Strength.jpg": {
    name: "Strength",
    upright: "Strength, courage, persuasion, influence, compassion.",
    reversed: "Inner strength, self-doubt, low energy, raw emotion.",
    advice: {
      upright: "Approach challenges with compassion and inner strength.",
      reversed: "Believe in yourself and nurture your inner resilience.",
    },
  },
  "09-TheHermit.jpg": {
    name: "The Hermit",
    upright: "Soul-searching, introspection, being alone, inner guidance.",
    reversed: "Isolation, loneliness, withdrawal.",
    advice: {
      upright: "Take time for reflection and seek your own truth.",
      reversed: "Reach out if you feel isolated; connection can help.",
    },
  },
  "10-WheelOfFortune.jpg": {
    name: "Wheel of Fortune",
    upright: "Good luck, karma, life cycles, destiny, a turning point.",
    reversed: "Bad luck, resistance to change, breaking cycles.",
    advice: {
      upright: "Embrace change and trust the cycles of life.",
      reversed: "Let go of resistance and allow change to happen.",
    },
  },
  "11-Justice.jpg": {
    name: "Justice",
    upright: "Justice, fairness, truth, cause and effect, law.",
    reversed: "Unfairness, lack of accountability, dishonesty.",
    advice: {
      upright: "Act with integrity and seek fairness in all matters.",
      reversed: "Take responsibility for your actions and seek the truth.",
    },
  },
  "12-TheHangedMan.jpg": {
    name: "The Hanged Man",
    upright: "Pause, surrender, letting go, new perspectives.",
    reversed: "Delays, resistance, stalling, indecision.",
    advice: {
      upright: "Let go and see things from a new perspective.",
      reversed: "Release resistance and allow yourself to move forward.",
    },
  },
  "13-Death.jpg": {
    name: "Death",
    upright: "Endings, change, transformation, transition.",
    reversed: "Resistance to change, personal transformation, inner purging.",
    advice: {
      upright: "Accept endings as a path to new beginnings.",
      reversed: "Embrace change and let go of what no longer serves you.",
    },
  },
  "14-Temperance.jpg": {
    name: "Temperance",
    upright: "Balance, moderation, patience, purpose.",
    reversed: "Imbalance, excess, self-healing, re-alignment.",
    advice: {
      upright: "Practice patience and seek balance in your life.",
      reversed: "Restore balance by moderating excesses.",
    },
  },
  "15-TheDevil.jpg": {
    name: "The Devil",
    upright: "Shadow self, attachment, addiction, restriction, sexuality.",
    reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment.",
    advice: {
      upright: "Acknowledge unhealthy attachments and work to break free.",
      reversed: "Let go of limiting beliefs and reclaim your power.",
    },
  },
  "16-TheTower.jpg": {
    name: "The Tower",
    upright:
      "Sudden change, upheaval, chaos, revelation, awakening.",
    reversed: "Personal transformation, fear of change, averting disaster.",
    advice: {
      upright: "Embrace necessary change, even if it feels disruptive.",
      reversed: "Face your fears and allow transformation to occur.",
    },
  },
  "17-TheStar.jpg": {
    name: "The Star",
    upright: "Hope, faith, purpose, renewal, spirituality.",
    reversed: "Lack of faith, despair, self-trust, disconnection.",
    advice: {
      upright: "Stay hopeful and trust in the future.",
      reversed: "Reconnect with your inner light and restore your faith.",
    },
  },
  "18-TheMoon.jpg": {
    name: "The Moon",
    upright: "Illusion, fear, anxiety, subconscious, intuition.",
    reversed: "Release of fear, repressed emotion, inner confusion.",
    advice: {
      upright: "Trust your intuition and move through uncertainty with care.",
      reversed: "Release your fears and seek clarity within.",
    },
  },
  "19-TheSun.jpg": {
    name: "The Sun",
    upright: "Positivity, fun, warmth, success, vitality.",
    reversed: "Inner child, feeling down, overly optimistic.",
    advice: {
      upright: "Enjoy the moment and share your joy with others.",
      reversed: "Nurture your inner child and find reasons to be optimistic.",
    },
  },
  "20-Judgement.jpg": {
    name: "Judgement",
    upright: "Judgement, rebirth, inner calling, absolution.",
    reversed: "Self-doubt, inner critic, ignoring the call.",
    advice: {
      upright: "Listen to your inner calling and embrace renewal.",
      reversed: "Release self-doubt and trust your true path.",
    },
  },
  "21-TheWorld.jpg": {
    name: "The World",
    upright: "Completion, integration, accomplishment, travel.",
    reversed: "Seeking personal closure, short-cuts, delays.",
    advice: {
      upright: "Celebrate your achievements and embrace new journeys.",
      reversed: "Seek closure and avoid taking shortcuts to success.",
    },
  },
};

function openModal(imgSrc, isReversed = false) {
  modalImg.src = imgSrc;
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  // Extract card filename
  const cardFile = imgSrc.split("/").pop();
  const meaning = cardMeanings[cardFile];

  // Set card name and meanings
  const cardNameElem = document.getElementById("card-name");
  const uprightElem = document.getElementById("meaning-upright");
  const reversedElem = document.getElementById("meaning-reversed");
  const adviceElem = document.getElementById("card-advice");

  if (meaning) {
    cardNameElem.textContent = meaning.name;
    uprightElem.textContent = isReversed ? "" : meaning.upright;
    reversedElem.textContent = isReversed ? meaning.reversed : "";
    uprightElem.style.display = isReversed ? "none" : "block";
    reversedElem.style.display = isReversed ? "block" : "none";
    adviceElem.textContent = isReversed ? meaning.advice.reversed : meaning.advice.upright;
    adviceElem.style.display = "block";
  } else {
    cardNameElem.textContent = "";
    uprightElem.textContent = "";
    reversedElem.textContent = "";
    uprightElem.style.display = "none";
    reversedElem.style.display = "none";
    adviceElem.textContent = "";
    adviceElem.style.display = "none";
  }

  // Animate image
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
  if (e.target === modal) {
    closeModal();
  } else if (e.target === closeBtn) {
    // Play click sound for close button
    /* const clickAudio = document.getElementById("click-audio");
    if (clickAudio && soundEnabled) {
      clickAudio.volume = 0.5;
      clickAudio.currentTime = 0;
      clickAudio.play();
    } */
    closeModal();
  }
});

// Sound toggle logic
const soundToggleIcon = document.getElementById("sound-toggle-icon");
const soundIconImg = document.getElementById("sound-icon-img");
let soundEnabled = true;

// Use your own icons: img/sound-on.png and img/sound-off.png (mute)
const SOUND_ON_ICON = "img/sound-on.png";
const SOUND_OFF_ICON = "img/sound-off.png";

// Load preference from localStorage if available
if (localStorage.getItem("mysticDrawSound") !== null) {
  soundEnabled = localStorage.getItem("mysticDrawSound") === "true";
}
updateSoundIcon();

soundToggleIcon.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem("mysticDrawSound", soundEnabled);
  updateSoundIcon();
});

// ? Updates the sound toggle icon based on the current sound state
function updateSoundIcon() {
  if (soundEnabled) {
    soundIconImg.src = SOUND_ON_ICON;
    soundIconImg.alt = "Sound On";
  } else {
    soundIconImg.src = SOUND_OFF_ICON;
    soundIconImg.alt = "Sound Off";
  }
}

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