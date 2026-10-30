document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Work reel ---------- */
/* The reel section is taller than the screen; its inner part sticks under the header.
   Scroll position picks the active project: its preview fills the background,
   its client name turns red and its service text shows on the right. */
const reel = document.querySelector('.reel');
const reelVideos = [...document.querySelectorAll('.reel-video')];
const reelClients = [...document.querySelectorAll('.reel-client')];
const reelOpen = document.querySelector('[data-reel-open]');
const reelService = document.querySelector('[data-reel-service]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeIndex = -1;

// Load a video only when it is (or is about to be) on screen.
const loadVideo = (video, preload) => {
  if (!video) return;
  if (!video.getAttribute('src')) video.src = video.dataset.src;
  if (preload === 'auto') video.preload = 'auto';
};

const reelScrollRange = () => {
  const sticky = reel.querySelector('.reel-sticky');
  return Math.max(1, reel.offsetHeight - sticky.offsetHeight);
};

const setActive = (index) => {
  if (index === activeIndex) return;
  activeIndex = index;
  reelVideos.forEach((video, i) => {
    const on = i === index;
    video.classList.toggle('is-active', on);
    if (on) {
      loadVideo(video, 'auto');
      if (!reduceMotion.matches) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  });
  loadVideo(reelVideos[index + 1]); // warm up the next one
  reelClients.forEach((client, i) => {
    client.classList.toggle('is-active', i === index);
    if (i === index) client.setAttribute('aria-current', 'true');
    else client.removeAttribute('aria-current');
  });
  const d = reelClients[index].dataset;
  reelService.textContent = d.role || '';
  reelOpen.setAttribute('aria-label', `Watch ${reelClients[index].textContent}`);
};

let reelTicking = false;
const updateReel = () => {
  reelTicking = false;
  const scrolled = -reel.getBoundingClientRect().top;
  const step = reelScrollRange() / reelClients.length;
  const index = Math.min(reelClients.length - 1, Math.max(0, Math.floor(scrolled / step)));
  setActive(index);
};
const requestReelUpdate = () => {
  if (!reelTicking) { reelTicking = true; requestAnimationFrame(updateReel); }
};
window.addEventListener('scroll', requestReelUpdate, { passive: true });
window.addEventListener('resize', requestReelUpdate);
updateReel();

// Pause the background video when the reel is scrolled out of view.
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    const video = reelVideos[activeIndex];
    if (!video) return;
    if (entry.isIntersecting && !reduceMotion.matches) video.play().catch(() => {});
    else video.pause();
  }).observe(reel.querySelector('.reel-sticky'));
}

// Clicking a client name scrolls to that project.
reelClients.forEach((client, i) => client.addEventListener('click', () => {
  const step = reelScrollRange() / reelClients.length;
  const top = reel.getBoundingClientRect().top + window.scrollY + i * step + step * 0.1;
  window.scrollTo({ top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
}));

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

// Clicking the background opens the active project's full film with sound.
reelOpen.addEventListener('click', () => {
  const active = reelClients[activeIndex];
  openModal(active.dataset.videoSrc, active);
  lastFocused = reelOpen;
});

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
