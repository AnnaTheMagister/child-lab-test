// Функция для инициализации гамбургер-меню
function initChildlabMobileMenu() {
  const menuToggle = document.querySelector('.childlab-menu-toggle');
  const primaryMenu = document.querySelector('.childlab-primary-menu');
  const body = document.body;
  
  if (!menuToggle || !primaryMenu) return;
  
  // Инициализация ARIA-атрибутов
  menuToggle.setAttribute('aria-expanded', 'false');
  primaryMenu.setAttribute('aria-expanded', 'false');
  
  // Обработчик клика по кнопке
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    
    // Переключаем состояние
    this.setAttribute('aria-expanded', !isExpanded);
    primaryMenu.setAttribute('aria-expanded', !isExpanded);
    
    // Блокируем/разблокируем скролл
    if (!isExpanded) {
      body.classList.add('menu-open');
      menuToggle.setAttribute('aria-label', 'Закрыть меню');
    } else {
      body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-label', 'Открыть меню');
    }
  });
  
  // Закрытие меню при клике на ссылку
  const menuLinks = primaryMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
  
  // Закрытие меню при клике вне его
  document.addEventListener('click', function(event) {
    if (!primaryMenu.contains(event.target) && 
        !menuToggle.contains(event.target) && 
        primaryMenu.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
    }
  });
  
  // Закрытие меню при нажатии Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && primaryMenu.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
    }
  });
  
  // Закрытие меню при ресайзе окна (на случай перехода с мобильного на десктоп)
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 992 && primaryMenu.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu();
      }
    }, 250);
  });
  
  // Функция закрытия меню
  function closeMobileMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    primaryMenu.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initChildlabMobileMenu);