document.getElementById('year').textContent = new Date().getFullYear();

const previews = document.querySelectorAll('.project-hover-video');
const playPreviews = () => previews.forEach((video) => video.play().catch(() => {}));

playPreviews();
window.addEventListener('load', playPreviews);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) playPreviews();
});

const modal = document.querySelector('[data-video-modal]');
const modalPlayer = document.querySelector('[data-video-modal-player]');
const closeModal = () => {
  modal.hidden = true;
  modalPlayer.pause();
  modalPlayer.currentTime = 0;
  document.body.style.overflow = '';
};

document.querySelectorAll('[data-video-modal-open]').forEach((project) => project.addEventListener('click', () => {
  const source = project.dataset.videoSrc;
  if (source && modalPlayer.querySelector('source').getAttribute('src') !== source) {
    modalPlayer.querySelector('source').setAttribute('src', source);
    modalPlayer.load();
  }
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalPlayer.play().catch(() => {});
}));

document.querySelector('[data-video-modal-close]')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});
