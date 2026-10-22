
const $ = (selector) => document.querySelector(selector);

const answers = {
  date: "02.01.2024",
  password: "190624"
};

const choices = {
  place: "",
  time: ""
};

// Переключение экранов
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(id);
  screen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Приветствие
setTimeout(() => {
  $("#introText").classList.add("hidden");
  $("#access").classList.remove("hidden");
}, 2600);

// Первый код
$("#dateForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const input = $("#dateInput").value.trim();

  if (input === answers.date) {
    const heart = $(".heart");

    heart.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.5) rotate(15deg)", opacity: 0 }
      ],
      { duration: 700, easing: "ease-in", fill: "forwards" }
    );

    setTimeout(() => showScreen("password"), 700);
  } else {
    $("#dateError").textContent =
      "Попробуй ещё раз, солнышко ❤️";

    $("#dateInput").animate(
      [
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 250 }
    );
  }
});

// Второй код
$("#passwordForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if ($("#passwordInput").value.trim() === answers.password) {
    const button = $("#passwordForm button");

    button.textContent = "Это точно ты! ❤️";

    document.body.animate(
      [
        { filter: "brightness(1)" },
        { filter: "brightness(1.8)" },
        { filter: "brightness(1)" }
      ],
      { duration: 800 }
    );

    setTimeout(() => showScreen("place"), 850);
  } else {
    $("#passwordError").textContent =
      "Кажется, что-то не совпадает ❤️";
  }
});

// Выбор места
document.querySelectorAll("[data-place]").forEach(button => {
  button.addEventListener("click", () => {
    choices.place = button.dataset.place;
    showScreen("time");
  });
});

// Выбор времени
document.querySelectorAll("[data-time]").forEach(button => {
  button.addEventListener("click", () => {
    choices.time = button.dataset.time;
    createTicket();
  });
});

// Загрузка и генерация билета
function createTicket() {
  showScreen("loading");

  const messages = [
    "Собираем воспоминания...",
    "Выбираем самые тёплые моменты...",
    "Готовим твой билет...",
    "Всё готово ❤️"
  ];

  let progress = 0;
  let messageIndex = 0;

  $("#progressBar").style.width = "0%";

  const loadingText = $("#loadingText");
  loadingText.textContent = messages[0];

  const interval = setInterval(() => {
    progress += 2;
    $("#progressBar").style.width = progress + "%";

    const nextIndex = Math.min(
      messages.length - 1,
      Math.floor(progress / 26)
    );

    if (nextIndex !== messageIndex) {
      messageIndex = nextIndex;
      loadingText.textContent = messages[messageIndex];
    }

    if (progress >= 100) {
      clearInterval(interval);
      fillTicket();
      showScreen("ticketScreen");
    }
  }, 70);
}

// Заполнение билета
function fillTicket() {
  $("#ticketPlace").textContent = choices.place;
  $("#ticketTime").textContent = choices.time;
  $("#ticketPlan").textContent =
    `Кино + ${choices.place.toLowerCase()}`;

  // Укажи реальную дату свидания, когда определишься.
  $("#ticketDate").textContent = "Скоро ❤️";
}

// Летающие сердечки на фоне
const particles = $("#particles");

function createParticle() {
  const particle = document.createElement("span");

  particle.className = "particle";
  particle.textContent = Math.random() > 0.5 ? "♡" : "✦";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.fontSize = (12 + Math.random() * 18) + "px";
  particle.style.animationDuration = (6 + Math.random() * 6) + "s";

  particles.appendChild(particle);

  setTimeout(() => particle.remove(), 12000);
}

setInterval(createParticle, 450);
