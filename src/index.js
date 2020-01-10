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
  //n: { note: NOTES[24] },
};

// === LITE SIZE
const PIANO_WIDTH = (window.innerWidth * 8) / 10 / (window.innerWidth / 2);
const PIANO_HEIGHT = 1;
const TILE_WIDTH =
  (PIANO_WIDTH / Object.keys(KEYBOARD_NOTES_MAPPING).length) * 2;
const TILE_HEIGHT = 1;

const DEFAULT_TILE_ROTATION = 0.0;
const MAX_TILE_ROTATION = 0.1;

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
  camera.position.set(0.28, 0, 1);

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
  group.position.set(-PIANO_WIDTH / 2, 0, -PIANO_HEIGHT / 2);
  let geometry = new THREE.BoxGeometry(TILE_WIDTH, TILE_HEIGHT, 0.1);
  geometry.translate(0, -TILE_HEIGHT / 2, 0);
  // TODO translate la geometry pour modifier le centre de rotation des touches

  let position = 0;

  Object.keys(KEYBOARD_NOTES_MAPPING).forEach(k => {
    let material = new THREE.MeshBasicMaterial({
      color: KEYBOARD_NOTES_MAPPING[k].note.sharp ? 0x000000 : 0xffe4c4,
      vertexColors: THREE.FaceColors,
    });
    let tile = new THREE.Mesh(geometry, material);
    if (KEYBOARD_NOTES_MAPPING[k].note.sharp) {
      noteColors(0x0000ff, tile);
      tile.position.set(position + TILE_WIDTH / 2, 1, 0.13);
    } else {
      position += TILE_WIDTH + 0.01;
      noteColors(0x000000, tile);
      tile.geometry.faces[6].color = new THREE.Color(0xf0f8ff);
      tile.geometry.faces[7].color = new THREE.Color(0xf0f8ff);
      tile.position.set(position, 0.6, 0.1);
    }
    KEYBOARD_NOTES_MAPPING[k].tile = tile;
    group.add(tile);
  });

  group.rotation.set(-0.7, 0, 0);
  scene.add(group);
};

const noteColors = (color, note) => {
  for (let i = 0; i < 6; i++) {
    note.geometry.faces[i].color = new THREE.Color(color);
  }
};

const updateViewportSize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const updateCanvasBackground = () => {
  let frequencies = [];
  Object.keys(KEYBOARD_NOTES_MAPPING).forEach(k => {
    if (keyboardEvents[k])
      frequencies.push(KEYBOARD_NOTES_MAPPING[k].note.frequency);
  });

  const frequenciesAvg = arrayAverage(frequencies);

  document.querySelector('canvas').style.backgroundColor =
    '#' +
    hexColorFromString(
      frequenciesAvg.toString(),
      NOTES[NOTES.length - 1].frequency.toString(),
      NOTES[0].frequency.toString(),
    );
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

  updateCanvasBackground();
};

const handleRepetitiveKeyboardEvents = () => {
  // handling tile rotation on playing
  for (let k of Object.keys(keyboardEvents)) {
    if (keyboardEvents[k] && KEYBOARD_NOTES_MAPPING[k]) {
      if (KEYBOARD_NOTES_MAPPING[k].tile.rotation.x < MAX_TILE_ROTATION)
        KEYBOARD_NOTES_MAPPING[k].tile.rotation.x += 0.05;
      if (KEYBOARD_NOTES_MAPPING[k].tile.rotation.x > MAX_TILE_ROTATION)
        KEYBOARD_NOTES_MAPPING[k].tile.rotation.x = MAX_TILE_ROTATION;
    }

    if (!keyboardEvents[k] && KEYBOARD_NOTES_MAPPING[k]) {
      if (KEYBOARD_NOTES_MAPPING[k].tile.rotation.x > DEFAULT_TILE_ROTATION)
        KEYBOARD_NOTES_MAPPING[k].tile.rotation.x -= 0.05;
      if (KEYBOARD_NOTES_MAPPING[k].tile.rotation.x < DEFAULT_TILE_ROTATION)
        KEYBOARD_NOTES_MAPPING[k].tile.rotation.x = DEFAULT_TILE_ROTATION;
    }
  }

  // rendering after mesh changes
  renderer.render(scene, camera);
};

const gameLoop = () => {
  requestAnimationFrame(gameLoop);

  handleRepetitiveKeyboardEvents();
};

// ========== //

init();
renderer.render(scene, camera);

gameLoop();
