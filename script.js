document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Work list ---------- */
/* Hovering (or tabbing to) a row shows that project's film full screen behind the list.
   The film keeps playing after the pointer leaves, until another row is hovered. */
const reel = document.querySelector('.reel');
const reelVideos = [...document.querySelectorAll('.reel-video')];
const workRows = [...document.querySelectorAll('.work-row')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeIndex = -1;
let reelVisible = true;

const setActive = (index) => {
  if (index === activeIndex) return;
  activeIndex = index;
  reelVideos.forEach((video, i) => {
    const on = i === index;
    video.classList.toggle('is-active', on);
    if (on) {
      video.preload = 'auto';
      if (reelVisible && !reduceMotion.matches) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  });
};

workRows.forEach((row, i) => {
  row.addEventListener('mouseenter', () => setActive(i));
  row.addEventListener('focus', () => setActive(i));
});
setActive(0);

// Pause the background film when the work section is scrolled out of view.
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    reelVisible = entry.isIntersecting;
    const video = reelVideos[activeIndex];
    if (reelVisible && !reduceMotion.matches) video.play().catch(() => {});
    else video.pause();
  }).observe(reel);
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
