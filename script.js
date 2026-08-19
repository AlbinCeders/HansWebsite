document.getElementById('year').textContent = new Date().getFullYear();

const logo = document.querySelector('.hero-logo-3d');
const logoDepth = logo?.querySelector('.logo-depth');

if (logoDepth) {
  const layers = document.createDocumentFragment();
  for (let depth = 0; depth <= 68; depth += 1) {
    const layer = document.createElement('i');
    layer.style.setProperty('--z', depth);
    layers.appendChild(layer);
  }
  logoDepth.appendChild(layers);
}

if (logo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(([entry]) => {
    logo.classList.toggle('is-paused', !entry.isIntersecting);
  }, { threshold: 0.08 });

  observer.observe(logo);
}
