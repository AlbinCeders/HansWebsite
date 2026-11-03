document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Work list ---------- */
/* The page is white by default. Hovering (or tabbing to) the text of a row fades that project's
   film in full screen behind the list; leaving the text fades it out again and pauses it. */
const reel = document.querySelector('.reel');
const reelVideos = [...document.querySelectorAll('.reel-video')];
const workRows = [...document.querySelectorAll('.work-row')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeIndex = -1;
let pauseTimer = null;

const showFilm = (index) => {
  clearTimeout(pauseTimer);
  activeIndex = index;
  reelVideos.forEach((video, i) => {
    const on = i === index;
    video.classList.toggle('is-active', on);
    if (on) {
      video.preload = 'auto';
      if (!reduceMotion.matches) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  });
};
// Pause once the fade-out has finished, so nothing plays behind a white page.
const hideFilm = () => {
  clearTimeout(pauseTimer);
  pauseTimer = setTimeout(() => reelVideos[activeIndex]?.pause(), 600);
};

workRows.forEach((row, i) => {
  row.querySelectorAll('span').forEach((text) => {
    text.addEventListener('mouseenter', () => showFilm(i));
    text.addEventListener('mouseleave', hideFilm);
  });
  row.addEventListener('focus', () => showFilm(i));
  row.addEventListener('blur', hideFilm);
});
// The first film starts loading in the background so the first hover is quick.
reelVideos[0].preload = 'auto';

/* ---------- Footer: About / Work ---------- */
/* Shows "About" (to the info section) while the work list is on screen,
   and "Work" (back up to the list) once the info section is in view. */
const footerToggle = document.querySelector('[data-footer-toggle]');
const infoSection = document.getElementById('info');
if (footerToggle && infoSection && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    const atInfo = entry.isIntersecting;
    footerToggle.textContent = atInfo ? 'Work' : 'About';
    footerToggle.setAttribute('href', atInfo ? '#work' : '#info');
  }, { threshold: 0.5 }).observe(infoSection);
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
  const d = trigger.dataset;
  modal.querySelector('[data-modal-title]').textContent = d.name || '';
  [['client', d.client], ['brand', d.brand], ['role', d.role], ['note', d.note]].forEach(([key, value]) => {
    const el = modal.querySelector(`[data-modal-${key}]`);
    el.textContent = value || '';
    (key === 'note' ? el : el.parentElement).hidden = !value;
  });
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

// Clicking a row opens that project's full film with sound.
workRows.forEach((row) => row.addEventListener('click', () => openModal(row.dataset.videoSrc, row)));

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
