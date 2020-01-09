import * as THREE from "three";

// === SCENE ELEMENTS

let camera, scene, renderer;

let resizeTimeout = null;

const keyboardEvents = {};

const init = () => {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  camera.position.set(0, 0, 1);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // updating renderer size upon window.resize
  window.addEventListener("resize", () => {
    if (resizeTimeout !== null) clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
  });

  window.addEventListener("keydown", event => {
    keyboardEvents[event.key] = true;
  });

  window.addEventListener("keyup", event => {
    keyboardEvents[event.key] = false;
  });

  window.addEventListener("resize", updateViewportSize);
  updateViewportSize();

  document.body.appendChild(renderer.domElement);
};

const updateViewportSize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const handleKeyboardEvents = () => {};

const gameLoop = () => {
  requestAnimationFrame(gameLoop);

  handleKeyboardEvents();
};

// ========== //

init();
renderer.render(scene, camera);

gameLoop();
