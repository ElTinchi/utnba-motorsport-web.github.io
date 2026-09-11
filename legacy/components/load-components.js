// Carga header y footer compartidos en todas las páginas
(function () {
  // Detectar la ruta base del proyecto
  // En GitHub Pages: /  o /repo-name/
  // En file://: calcular ruta relativa según la profundidad
  function getBasePath() {
    if (window.location.protocol === 'file:') {
      // Contar cuántos niveles estamos desde la raíz del proyecto
      // La raíz tiene index.html, nosotros.html, etc.
      var path = window.location.pathname.replace(/\\/g, '/');
      // Buscar dónde termina la carpeta raíz del proyecto
      var parts = path.split('/');
      var depth = 0;
      // Si estamos en equipo/diseno/index.html -> depth = 2
      // Si estamos en nosotros.html -> depth = 0
      // Buscar index.html o nosotros.html en la ruta para determinar la raíz
      for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === 'equipo') {
          // Encontramos la carpeta equipo, la raíz es un nivel arriba
          depth = parts.length - 1 - i - 1;
          break;
        }
        if (parts[i] === 'index.html' || parts[i] === 'nosotros.html') {
          // Estamos en la raíz
          depth = 0;
          break;
        }
      }
      // Si la URL actual tiene /equipo/ en ella, calcular profundidad
      if (path.indexOf('/equipo/') !== -1) {
        // equipo/AREA/index.html = 2 niveles
        depth = 2;
      }
      var prefix = '';
      for (var j = 0; j < depth; j++) {
        prefix += '../';
      }
      return prefix;
    }
    // Para servidores web (GitHub Pages, localhost, etc.)
    return '/';
  }

  var basePath = getBasePath();

  function loadComponent(url, targetSelector) {
    var target = document.querySelector(targetSelector);
    if (!target) return;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) { // status 0 for file://
          var html = xhr.responseText;
          // Reemplazar rutas absolutas / con la ruta base correcta
          html = html.replace(/href="\//g, 'href="' + basePath);
          html = html.replace(/src="\//g, 'src="' + basePath);
          target.innerHTML = html;

          // Actualizar año en el footer
          var yearSpans = document.querySelectorAll('.js-current-year');
          yearSpans.forEach(function (span) {
            span.textContent = new Date().getFullYear();
          });

          // Inicializar header interactivity después de cargarlo
          if (targetSelector === '#site-header') {
            initHeaderInteractivity();
          }
        }
      }
    };
    xhr.send();
  }

  function initHeaderInteractivity() {
    // Hamburger menu toggle
    var hamburger = document.querySelector('.header__hamburger');
    var nav = document.querySelector('.nav');
    if (hamburger && nav) {
      hamburger.addEventListener('click', function () {
        var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isOpen);
        hamburger.setAttribute('aria-label', isOpen ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
        nav.classList.toggle('nav--open', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });

      // Close mobile nav when clicking a link
      nav.querySelectorAll('.nav__link, .nav__dropdown-link').forEach(function (link) {
        link.addEventListener('click', function () {
          if (nav.classList.contains('nav--open')) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
            nav.classList.remove('nav--open');
            document.body.style.overflow = '';
          }
        });
      });
    }

    // Dropdown toggle keyboard accessibility
    var dropdownToggle = document.querySelector('.nav__dropdown-toggle');
    var dropdown = dropdownToggle ? dropdownToggle.nextElementSibling : null;

    if (dropdownToggle && dropdown) {
      // Toggle dropdown on click/Enter/Space
      dropdownToggle.addEventListener('click', function () {
        var isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        dropdownToggle.setAttribute('aria-expanded', !isExpanded);
        // For mobile nav
        dropdown.setAttribute('data-open', !isExpanded);
      });

      // Close dropdown on Escape
      dropdownToggle.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          dropdownToggle.setAttribute('aria-expanded', 'false');
          dropdown.setAttribute('data-open', 'false');
          dropdownToggle.focus();
        }
        // Arrow down opens and focuses first link
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          dropdownToggle.setAttribute('aria-expanded', 'true');
          dropdown.setAttribute('data-open', 'true');
          var firstLink = dropdown.querySelector('.nav__dropdown-link');
          if (firstLink) firstLink.focus();
        }
      });

      // Keyboard navigation within dropdown
      dropdown.addEventListener('keydown', function (e) {
        var links = dropdown.querySelectorAll('.nav__dropdown-link');
        var currentIndex = Array.from(links).indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var next = currentIndex + 1 < links.length ? currentIndex + 1 : 0;
          links[next].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentIndex <= 0) {
            dropdownToggle.focus();
          } else {
            links[currentIndex - 1].focus();
          }
        } else if (e.key === 'Escape') {
          dropdownToggle.setAttribute('aria-expanded', 'false');
          dropdown.setAttribute('data-open', 'false');
          dropdownToggle.focus();
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function (e) {
        if (!dropdownToggle.contains(e.target) && !dropdown.contains(e.target)) {
          dropdownToggle.setAttribute('aria-expanded', 'false');
          dropdown.setAttribute('data-open', 'false');
        }
      });
    }
  }

  // Versión para evitar que el navegador use header/footer cacheados viejos
  var V = '?v=12';
  loadComponent(basePath + 'components/header.html' + V, '#site-header');
  loadComponent(basePath + 'components/footer.html' + V, '#site-footer');
})();
