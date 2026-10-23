
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

/* =====================================
   WELCOME — ПРИВЕТСТВИЕ И СЕРДЦЕ
   Заменяет старый setTimeout и dateForm
===================================== */

const welcomeScreen = document.getElementById("welcome");
const introStage = document.getElementById("introStage");
const introText = document.getElementById("introText");
const access = document.getElementById("access");
const dateInput = document.getElementById("dateInput");
const heartButton = document.getElementById("heartButton");
const openHeartButton = document.getElementById("openHeartButton");
const dateError = document.getElementById("dateError");
const heartParticles = document.getElementById("heartParticles");

let welcomeUnlocked = false;

// Последовательность HELLO → Nika → сердце
function startWelcome() {
  introStage.classList.remove("hidden");
  access.classList.add("hidden");

  introText.textContent = "HELLO";
  introText.style.animation = "none";

  // Перезапуск анимации при повторном открытии экрана
  void introText.offsetWidth;
  introText.style.animation = "";

  setTimeout(() => {
    introText.textContent = "Nika";

    introText.animate(
      [
        { opacity: 0, transform: "translateY(18px) scale(.8)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(-15px) scale(1.1)" }
      ],
      {
        duration: 1700,
        easing: "ease-in-out",
        fill: "forwards"
      }
    );
  }, 1700);

  setTimeout(() => {
    introStage.classList.add("hidden");
    access.classList.remove("hidden");
  }, 3200);
}

startWelcome();

// Звёздочки на фоне
const starsContainer = document.getElementById("welcomeStars");

for (let i = 0; i < 34; i++) {
  const star = document.createElement("span");

  star.className = "welcome-star";
  star.textContent = Math.random() > 0.5 ? "✦" : "·";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.fontSize = (8 + Math.random() * 12) + "px";
  star.style.animationDuration = (1.5 + Math.random() * 3) + "s";
  star.style.animationDelay = Math.random() * 3 + "s";

  starsContainer.appendChild(star);
}

// Нажатие на сердце фокусирует поле даты
heartButton.addEventListener("click", (event) => {
  if (event.target !== dateInput) {
    dateInput.focus();
  }

  heartButton.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(.94)" },
      { transform: "scale(1.03)" },
      { transform: "scale(1)" }
    ],
    { duration: 400, easing: "ease-out" }
  );
});

// Автоматический формат даты: 02012024 → 02.01.2024
dateInput.addEventListener("input", () => {
  let digits = dateInput.value.replace(/\D/g, "").slice(0, 8);

  if (digits.length > 4) {
    digits = digits.slice(0, 2) + "." +
             digits.slice(2, 4) + "." +
             digits.slice(4);
  } else if (digits.length > 2) {
    digits = digits.slice(0, 2) + "." + digits.slice(2);
  }

  dateInput.value = digits;

  heartButton.classList.toggle(
    "has-value",
    digits.length > 0
  );

  dateError.textContent = "";
});

// Проверка даты по кнопке или клавише Enter
dateInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    unlockHeart();
  }
});

openHeartButton.addEventListener("click", unlockHeart);

function unlockHeart() {
  if (welcomeUnlocked) return;

  if (dateInput.value.trim() !== "02.01.2024") {
    dateError.textContent = "Это особенная дата. Попробуй ещё раз, малыш♥";

    dateInput.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 350 }
    );

    heartButton.animate(
      [
        { filter: "brightness(1)" },
        { filter: "brightness(1.6)" },
        { filter: "brightness(1)" }
      ],
      { duration: 450 }
    );

    return;
  }

  welcomeUnlocked = true;dateError.textContent = "";

  // Взрыв маленьких сердечек и звёзд
  heartParticles.classList.add("bursting");

  const symbols = ["♥", "♡", "✦", "✧", "♥", "·"];

  for (let i = 0; i < 34; i++) {
    const fragment = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 190;

    fragment.className = "heart-fragment";
    fragment.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    fragment.style.setProperty("--dx",
      Math.cos(angle) * distance + "px");
    fragment.style.setProperty("--dy",
      Math.sin(angle) * distance + "px");
    fragment.style.setProperty("--rot",
      (Math.random() * 360 - 180) + "deg");

    fragment.style.animationDelay =
      Math.random() * 180 + "ms";

    heartParticles.appendChild(fragment);
  }

  welcomeScreen.classList.add("is-unlocking");

  // Переход на существующий экран пароля
  setTimeout(() => {
    heartParticles.replaceChildren();
    heartParticles.classList.remove("bursting");
    welcomeScreen.classList.remove("is-unlocking");

    showScreen("password");
  }, 1050);
}

/* =========================================
   PASSWORD SCREEN — INTERACTIONS
========================================= */

const passwordScreen = document.getElementById("password");
const passwordInput = document.getElementById("passwordInput");
const passwordForm = document.getElementById("passwordForm");
const passwordError = document.getElementById("passwordError");
const passwordDots = document.querySelectorAll("#passwordDots span");
const showPasswordButton = document.getElementById("showPassword");
const passwordParticles = document.getElementById("passwordParticles");

let passwordPassed = false;

// Показываем или скрываем вводимый пароль
showPasswordButton.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";
  showPasswordButton.textContent = isHidden ? "◎" : "◉";
});

// Разрешаем вводить только цифры
passwordInput.addEventListener("input", () => {
  passwordInput.value = passwordInput.value
    .replace(/\D/g, "")
    .slice(0, 6);

  passwordError.textContent = "";

  passwordDots.forEach((dot, index) => {
    dot.classList.toggle(
      "filled",
      index < passwordInput.value.length
    );
  });
});

// Летающие декоративные сердечки
function createPasswordParticle() {
  if (!passwordScreen.classList.contains("active")) return;

  const particle = document.createElement("span");

  particle.className = "password-particle";
  particle.textContent =
    Math.random() > 0.45 ? "♡" : "✦";

  particle.style.left = Math.random() * 100 + "%";
  particle.style.fontSize =
    (10 + Math.random() * 15) + "px";

  particle.style.animationDuration =
    (5 + Math.random() * 5) + "s";

  passwordParticles.appendChild(particle);

  setTimeout(() => particle.remove(), 11000);
}

const passwordParticleTimer = setInterval(
  createPasswordParticle,
  650
);

// Проверка пароля
passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordPassed) return;

  if (passwordInput.value !== "190624") {
    passwordError.textContent =
      "Хмм... Попробуй ещё раз, любимая ♡";

    passwordScreen.classList.remove("password-shake");

    // Перезапускаем анимацию ошибки
    void passwordScreen.offsetWidth;
    passwordScreen.classList.add("password-shake");

    setTimeout(() => {
      passwordScreen.classList.remove("password-shake");
    }, 450);

    return;
  }

  passwordPassed = true;

  passwordError.textContent = "";
  passwordScreen.classList.add("password-success");

  const submitButton = passwordForm.querySelector("button[type='submit']");
  submitButton.innerHTML = "<span>Доступ открыт</span><span>♥</span>";

  // Заполняем все шесть индикаторов
  passwordDots.forEach(dot => dot.classList.add("filled"));

  // Дополнительная вспышка
  passwordScreen.animate(
    [
      { opacity: 1, filter: "brightness(1)" },
      { opacity: 1, filter: "brightness(1.8)" },
      { opacity: 1, filter: "brightness(1)" }
    ],
    { duration: 850, easing: "ease-in-out" }
  );

  setTimeout(() => {
    passwordScreen.classList.remove("password-success");
    showScreen("place");
  }, 950);
});



// Выбор времени
document.querySelectorAll("[data-time]").forEach(button => {
  button.addEventListener("click", () => {
    choices.time = button.dataset.time;
    createTicket();
  });
});

// Создание романтической загрузки билета
let ticketLoadingInterval = null;
let particleInterval = null;

function createLoadingParticle() {
  const container = $("#loadingParticles");
  if (!container) return;

  const particle = document.createElement("span");
  const symbols = ["♡", "✦", "✧", "·"];

  particle.className = "loading-particle";
  particle.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  particle.style.left = Math.random() * 100 + "%";
  particle.style.setProperty(
    "--duration",
    5 + Math.random() * 5 + "s"
  );
  particle.style.fontSize = 9 + Math.random() * 15 + "px";

  container.appendChild(particle);

  setTimeout(() => particle.remove(), 10500);
}

function createTicket() {
  // Не допускаем одновременный запуск нескольких загрузок
  clearInterval(ticketLoadingInterval);
  clearInterval(particleInterval);

  showScreen("loading");

  const messages = [
    "Собираем наши воспоминания...",
    "Выбираем самые тёплые моменты...",
    "Добавляем немного магии...",
    "Готовим твой билет...",
    "Всё готово ❤️"
  ];

  let progress = 0;
  let messageIndex = 0;

  const progressBar = $("#progressBar");
  const progressPercent = $("#progressPercent");
  const loadingText = $("#loadingText");
  const particleContainer = $("#loadingParticles");

  progressBar.style.width = "0%";
  progressPercent.textContent = "0%";
  loadingText.textContent = messages[0];

  if (particleContainer) particleContainer.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    createLoadingParticle();
  }

  particleInterval = setInterval(createLoadingParticle, 450);

  const duration = 6500;
  const startedAt = Date.now();

  ticketLoadingInterval = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    progress = Math.min(100, (elapsed / duration) * 100);

    progressBar.style.width = progress + "%";
    progressPercent.textContent = Math.floor(progress) + "%";

    const nextIndex = Math.min(
      messages.length - 1,
      Math.floor(progress / 25)
    );

    if (nextIndex !== messageIndex) {
      messageIndex = nextIndex;
      loadingText.style.opacity = "0";
      loadingText.style.transform = "translateY(5px)";

      setTimeout(() => {
        loadingText.textContent = messages[messageIndex];
        loadingText.style.opacity = "1";
        loadingText.style.transform = "translateY(0)";
      }, 220);
    }

    if (progress >= 100) {
      clearInterval(ticketLoadingInterval);
      clearInterval(particleInterval);

      ticketLoadingInterval = null;
      particleInterval = null;

      fillTicket();
      showScreen("ticketScreen");
    }
  }, 40);
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



/* ==========================================
   PLACE SCREEN — INTERACTIVE CHOICE
========================================== */

const placeScreen = document.getElementById("place");
const placeCards = document.querySelectorAll(".place-card");
const placeCounter = document.getElementById("placeCounter");
const placeHint = document.getElementById("placeHint");
const continuePlace = document.getElementById("continuePlace");
const placeStars = document.getElementById("placeStars");

let selectedPlace = localStorage.getItem("selectedPlace") || "";

// Восстанавливаем выбор, если девушка вернулась на страницу
function updatePlaceSelection() {
  placeCards.forEach(card => {
    const isSelected = card.dataset.place === selectedPlace;

    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });

  placeCounter.textContent = selectedPlace ? "1 / 1" : "0 / 1";
  continuePlace.disabled = !selectedPlace;

  if (selectedPlace) {
    placeHint.textContent = `Твой выбор: ${selectedPlace} ♡`;
    placeHint.classList.add("chosen");
  } else {
    placeHint.textContent = "✦ Выбери то, чего тебе хочется";
    placeHint.classList.remove("chosen");
  }
}
// Выбор места

document.querySelectorAll("[data-place]").forEach(button => {
  button.addEventListener("click", () => {
    choices.place = button.dataset.place;
  });
});


placeCards.forEach(card => {
  card.setAttribute("aria-pressed", "false");

  card.addEventListener("click", () => {
    selectedPlace = card.dataset.place;

    localStorage.setItem("selectedPlace", selectedPlace);

    updatePlaceSelection();

    // Маленькая анимация выбранной карточки
    card.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(.97)" },
        { transform: "scale(1.02)" },
        { transform: "scale(1)" }
      ],
      { duration: 300, easing: "ease-out" }
    );
  });
});

updatePlaceSelection();

// Декоративные звёзды
if (placeStars && !placeStars.children.length) {
  for (let i = 0; i < 25; i++) {
    const star = document.createElement("span");

    star.className = "place-star";
    star.textContent = Math.random() > .5 ? "✦" : "·";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.fontSize = (8 + Math.random() * 12) + "px";
    star.style.animationDelay = Math.random() * 3 + "s";
    star.style.animationDuration = (2 + Math.random() * 3) + "s";

    placeStars.appendChild(star);
  }
}

// Переход на страницу выбора времени
continuePlace.addEventListener("click", () => {
  if (!selectedPlace) return;

  localStorage.setItem("selectedPlace", selectedPlace);

  continuePlace.disabled = true;
  continuePlace.innerHTML = "<span>Продолжаем наше свидание...</span> <span>♡</span>";

  setTimeout(() => {
    showScreen("time");

    // Возвращаем кнопку в исходное состояние
    continuePlace.disabled = false;
    continuePlace.innerHTML =
      "<span>Продолжить наше свидание</span><span>♡</span>";
  }, 350);
});

const saveTicketBtn = document.getElementById("saveTicketBtn");

saveTicketBtn.addEventListener("click", async () => {
    const ticket = document.getElementById("ticketCard");

    if (!ticket || !window.html2canvas) {
        alert("Не удалось подготовить билет. Попробуй ещё раз ❤️");
        return;
    }

    saveTicketBtn.disabled = true;
    saveTicketBtn.textContent = "Создаём изображение...";

    try {
        const canvas = await html2canvas(ticket, {
            scale: 3,
            backgroundColor: null,
            useCORS: true
        });

        const link = document.createElement("a");
        link.download = "Наше-свидание.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (error) {
        alert("Не получилось сохранить билет. Можно сделать скриншот ❤️");
        console.error(error);
    } finally {
        saveTicketBtn.disabled = false;
        saveTicketBtn.innerHTML = "<span>♡</span> Сохранить билет";
    }
});



saveTicketBtn.addEventListener("click", async () => {
  const ticket = document.getElementById("ticketCard");

  if (!ticket || typeof html2canvas === "undefined") {
    alert("Не удалось подготовить билет. Попробуй обновить страницу ❤️");
    return;
  }

  saveTicketBtn.disabled = true;
  saveTicketBtn.innerHTML = "Готовим твою фотографию...";

  try {
    // Ждём загрузки фото
    const images = [...ticket.querySelectorAll("img")];

    await Promise.all(
      images.map(img => {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }

        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    ticket.classList.add("exporting");

    const canvas = await html2canvas(ticket, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
      logging: false
    });

    ticket.classList.remove("exporting");

    const link = document.createElement("a");
    link.download = "Nika-Our-Special-Date.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    ticket.classList.remove("exporting");
    console.error("Ошибка сохранения билета:", error);
    alert("Не получилось сохранить билет. Попробуй сделать скриншот ❤️");
  } finally {
    saveTicketBtn.disabled = false;
    saveTicketBtn.innerHTML = "<span>♡</span> Сохранить билет";
  }
});