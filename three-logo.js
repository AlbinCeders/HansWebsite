import * as THREE from './assets/vendor/three.module.js';
import { GLTFLoader } from './assets/vendor/GLTFLoader.js';
import { DRACOLoader } from './assets/vendor/DRACOLoader.js';

const host = document.querySelector('.hero-logo-3d');
const canvas = host?.querySelector('.logo-canvas');

if (host && canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 19);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x77736d, 2.8));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(4, 7, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd8d3c9, 2);
  fill.position.set(-6, -2, 5);
  scene.add(fill);

  const draco = new DRACOLoader();
  draco.setDecoderPath('./assets/vendor/draco/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  let logo;
  loader.load('./assets/hans-logo-3d.glb', (gltf) => {
    logo = gltf.scene;
    logo.rotation.x = -0.1;
    scene.add(logo);
    host.classList.add('is-loaded');
  });

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  const clock = new THREE.Clock();
  const render = () => {
    requestAnimationFrame(render);
    if (logo) logo.rotation.y = clock.getElapsedTime() * (Math.PI * 2 / 20);
    renderer.render(scene, camera);
  };
  render();
}
