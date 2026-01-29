document.addEventListener("DOMContentLoaded", function () {
  // Элементы
  const switcher = document.getElementById("readingModeSwitcher");
  const toggleBtn = document.getElementById("mobileSwitcherToggle");
  const closeBtn = document.getElementById("switcherClose");

  // Проверяем, мобильное ли устройство
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Открытие виджета
  function openSwitcher() {
    switcher.classList.add("active");
    // Создаем оверлей если его нет
    let overlay = document.querySelector(".switchers-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "switchers-overlay";
      document.body.appendChild(overlay);
    }
    overlay.classList.add("active");
    overlay.addEventListener("click", closeSwitcher);
    document.body.style.overflow = "hidden";
  }

  // Закрытие виджета
  function closeSwitcher() {
    switcher.classList.remove("active");
    const overlay = document.querySelector(".switchers-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      overlay.removeEventListener("click", closeSwitcher);
    }
    document.body.style.overflow = "";
  }

  // Обработчики событий
  if (toggleBtn) {
    toggleBtn.addEventListener("click", openSwitcher);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSwitcher);
  }

  // Закрытие при нажатии Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && switcher.classList.contains("active")) {
      closeSwitcher();
    }
  });

  // Адаптация при изменении размера окна
  window.addEventListener("resize", function () {
    if (!isMobile() && switcher.classList.contains("active")) {
      closeSwitcher();
    }
  });

  // Закрытие при клике на ссылки внутри виджета (если нужно)
  const switcherLinks = switcher.querySelectorAll("a");
  switcherLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (isMobile()) {
        // Закрываем виджет только на мобильных
        setTimeout(closeSwitcher, 300); // Небольшая задержка для плавности
      }
    });
  });
});
