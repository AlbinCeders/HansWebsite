document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.project-hover-video').forEach((video) => {
  const project = video.closest('.project');

  project.addEventListener('mouseenter', () => {
    video.play().catch(() => {});
  });

  project.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
});
