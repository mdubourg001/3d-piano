// === CONSTANTS

const KEYBOARD_NOTES_MAPPING = {
  // first octave
  q: { note: NOTES[0] },
  w: { note: NOTES[1] },
  e: { note: NOTES[2] },
  r: { note: NOTES[3] },
  t: { note: NOTES[4] },
  y: { note: NOTES[5] },
  u: { note: NOTES[6] },
  i: { note: NOTES[7] },
  o: { note: NOTES[8] },
  p: { note: NOTES[9] },
  a: { note: NOTES[10] },
  s: { note: NOTES[11] },
  // second octave
  d: { note: NOTES[12] },
  f: { note: NOTES[13] },
  g: { note: NOTES[14] },
  h: { note: NOTES[15] },
  j: { note: NOTES[16] },
  k: { note: NOTES[17] },
  l: { note: NOTES[18] },
  z: { note: NOTES[19] },
  x: { note: NOTES[20] },
  c: { note: NOTES[21] },
  v: { note: NOTES[22] },
  b: { note: NOTES[23] },
  // third octave
  n: { note: NOTES[24] },
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
      handlePressedKeyboardEvent(event.key);
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

  //  create notes group
  let group = new THREE.Group();
  let geometry = new THREE.BoxGeometry(0.1, 0.6, 0.1);
  let material = new THREE.MeshBasicMaterial({
    color: 0xffe4c4,
    vertexColors: THREE.FaceColors,
  });
  let position = -1.5;

  for (let i = 0; i < 11; i++) {
    let note = new THREE.Mesh(geometry, material);
    note.geometry.faces[6].color = new THREE.Color(0xf0f8ff);
    note.geometry.faces[7].color = new THREE.Color(0xf0f8ff);
    note.position.set(position, 0.6, 0.1);
    group.add(note);
    position += 0.12;
  }

  group.rotation.set(-0.7, 0, 0);
  scene.add(group);
};

const updateViewportSize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const handlePressedKeyboardEvent = k => {
  if (keyboardEvents[k] || !KEYBOARD_NOTES_MAPPING[k]) return;

  keyboardEvents[event.key] = true;
  const key = KEYBOARD_NOTES_MAPPING[k];

  if (!key.note.paused) {
    key.note.pause();
    key.note.fastSeek(0.0);
  }

  key.note.play();
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
