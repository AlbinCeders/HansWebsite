document.getElementById('year').textContent = new Date().getFullYear();

const logo = document.querySelector('.hero-logo-3d');

if (logo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(([entry]) => {
    logo.classList.toggle('is-paused', !entry.isIntersecting);
  }, { threshold: 0.08 });

  observer.observe(logo);
}
