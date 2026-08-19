document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.project-hover-video').forEach((video) => {
  const project = video.closest('.project, .featured-project');

  project.addEventListener('mouseenter', () => {
    video.play().catch(() => {});
  });

  project.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
});

const modal = document.querySelector('[data-video-modal]');
const modalPlayer = document.querySelector('[data-video-modal-player]');
const closeModal = () => {
  modal.hidden = true;
  modalPlayer.pause();
  modalPlayer.currentTime = 0;
  document.body.style.overflow = '';
};

document.querySelector('[data-video-modal-open]')?.addEventListener('click', () => {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalPlayer.play().catch(() => {});
});

document.querySelector('[data-video-modal-close]')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});
