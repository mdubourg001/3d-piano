// === CONSTANTS

const KEYBOARD_NOTES_MAPPING = {
  q: { note: NOTES[0] },
};

// === SCENE ELEMENTS

let camera, scene, renderer;

// === BUSINESS

let resizeTimeout = null;
const keyboardEvents = {};

const init = () => {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10,
  );
  camera.position.set(0, 0, 1);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // updating renderer size upon window.resize
  window.addEventListener('resize', () => {
    if (resizeTimeout !== null) clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
  });

  window.addEventListener(
    'keydown',
    event => {
      keyboardEvents[event.key] = true;
      handlePressedKeyboardEvents();
    },
    false,
  );

  window.addEventListener(
    'keyup',
    event => {
      keyboardEvents[event.key] = false;
    },
    false,
  );

  window.addEventListener('resize', updateViewportSize);
  updateViewportSize();

  document.body.appendChild(renderer.domElement);
};

const updateViewportSize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const handlePressedKeyboardEvents = () => {
  for (let k of Object.keys(KEYBOARD_NOTES_MAPPING)) {
    const key = KEYBOARD_NOTES_MAPPING[k];

    if (keyboardEvents[k]) {
      if (!key.note.paused) {
        key.note.pause();
        key.note.fastSeek(0.0);
      }

      key.note.play();
      keyboardEvents[k] = false;
    }
  }
};

const handleRepetitiveKeyboardEvents = () => {};

const gameLoop = () => {
  requestAnimationFrame(gameLoop);

  handleRepetitiveKeyboardEvents();
};

// ========== //

init();
renderer.render(scene, camera);

gameLoop();
