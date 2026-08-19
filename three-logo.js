import * as THREE from './assets/vendor/three.module.js';
import { GLTFLoader } from './assets/vendor/GLTFLoader.js';
import { DRACOLoader } from './assets/vendor/DRACOLoader.js';
import { RoomEnvironment } from './assets/vendor/RoomEnvironment.js';

const host = document.querySelector('.hero-logo-3d');
const canvas = host?.querySelector('.logo-canvas');

if (host && canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.42;

  const scene = new THREE.Scene();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const studio = new RoomEnvironment();
  scene.environment = pmremGenerator.fromScene(studio, 0.04).texture;
  studio.dispose();
  pmremGenerator.dispose();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 19);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xa7a39b, 3.5));
  const key = new THREE.DirectionalLight(0xffffff, 4.4);
  key.position.set(4, 7, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xf6f3eb, 2.8);
  fill.position.set(-6, -2, 5);
  scene.add(fill);

  const draco = new DRACOLoader();
  draco.setDecoderPath('./assets/vendor/draco/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  let logo;
  loader.load('./assets/hans-logo-3d.glb', (gltf) => {
    logo = gltf.scene;
    logo.traverse((object) => {
      if (object.isMesh && object.material) {
        object.material.color.set(0xf2f0e9);
        object.material.metalness = 0.92;
        object.material.roughness = 0.18;
        object.material.envMapIntensity = 1.8;
      }
    });
    logo.rotation.x = -0.08;
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
