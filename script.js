document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Hover previews: play only while visible ---------- */
const previews = document.querySelectorAll('.project-hover-video');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.1 });
  previews.forEach((video) => observer.observe(video));
}

/* ---------- Video modal ---------- */
const modal = document.querySelector('[data-video-modal]');
const modalPlayer = document.querySelector('[data-video-modal-player]');
const closeButton = document.querySelector('[data-video-modal-close]');
let lastFocused = null;

const openModal = (source, trigger) => {
  lastFocused = trigger;
  const sourceEl = modalPlayer.querySelector('source');
  if (source && sourceEl.getAttribute('src') !== source) {
    sourceEl.setAttribute('src', source);
    modalPlayer.load();
  }
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  closeButton.focus();
  modalPlayer.play().catch(() => {});
};

const closeModal = () => {
  modal.hidden = true;
  modalPlayer.pause();
  modalPlayer.currentTime = 0;
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
};

document.querySelectorAll('[data-video-modal-open]').forEach((project) =>
  project.addEventListener('click', () => openModal(project.dataset.videoSrc, project)));

closeButton?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (modal.hidden) return;
  if (event.key === 'Escape') return closeModal();
  if (event.key === 'Tab') {
    // Keep keyboard focus inside the modal: close button <-> player
    const focusable = [closeButton, modalPlayer];
    const index = focusable.indexOf(document.activeElement);
    const next = event.shiftKey ? index - 1 : index + 1;
    event.preventDefault();
    focusable[(next + focusable.length) % focusable.length].focus();
  }
});
