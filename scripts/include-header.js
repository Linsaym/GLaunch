document.addEventListener('DOMContentLoaded', () => {
  const placeholders = document.querySelectorAll('[data-include="header"]');

  placeholders.forEach(async (placeholder) => {
    try {
      const response = await fetch('components/header.html', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to load header: ${response.status}`);
      }

      const html = await response.text();
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      const header = template.content.firstElementChild;

      const active = placeholder.getAttribute('data-active');
      if (active) {
        const activeLink = header.querySelector(`[data-nav="${active}"]`);
        if (activeLink) {
          activeLink.classList.add('is-active');
        }
      }

      const navToggle = header.querySelector('.nav-toggle');
      const navLinks = header.querySelectorAll('.nav a');

      if (navToggle) {
        const closeMenu = () => {
          header.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded', 'false');
        };

        navToggle.addEventListener('click', (event) => {
          event.stopPropagation();
          const isOpen = header.classList.toggle('nav-open');
          navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.forEach((link) => {
          link.addEventListener('click', () => {
            if (window.innerWidth <= 720) {
              closeMenu();
            }
          });
        });

        document.addEventListener('click', (event) => {
          if (!header.contains(event.target)) {
            closeMenu();
          }
        });

        window.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            closeMenu();
          }
        });
      }

      placeholder.replaceWith(header);
    } catch (error) {
      console.error(error);
    }
  });
});

