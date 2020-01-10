// === CONSTANTS

const isAzerty = (navigator.language || navigator.userLanguage) === 'fr';

const KEYBOARD_NOTES_MAPPING = {
  // first octave
  [isAzerty ? 'a' : 'q']: { note: NOTES[0] },
  [isAzerty ? 'z' : 'w']: { note: NOTES[1] },
  e: { note: NOTES[2] },
  r: { note: NOTES[3] },
  t: { note: NOTES[4] },
  y: { note: NOTES[5] },
  u: { note: NOTES[6] },
  i: { note: NOTES[7] },
  o: { note: NOTES[8] },
  p: { note: NOTES[9] },
  [isAzerty ? 'q' : 'a']: { note: NOTES[10] },
  s: { note: NOTES[11] },
  // second octave
  d: { note: NOTES[12] },
  f: { note: NOTES[13] },
  g: { note: NOTES[14] },
  h: { note: NOTES[15] },
  j: { note: NOTES[16] },
  k: { note: NOTES[17] },
  l: { note: NOTES[18] },
  [isAzerty ? 'm' : 'z']: { note: NOTES[19] },
  [isAzerty ? 'w' : 'x']: { note: NOTES[20] },
  [isAzerty ? 'x' : 'c']: { note: NOTES[21] },
  [isAzerty ? 'c' : 'v']: { note: NOTES[22] },
  [isAzerty ? 'v' : 'b']: { note: NOTES[23] },
};

// === RAYCASTER INIT

let raycaster = new THREE.Raycaster();
let lastTileClicked = null;

// === TILE SIZE

const PIANO_WIDTH = (window.innerWidth * 8) / 10 / (window.innerWidth / 2);
const PIANO_HEIGHT = 1;
const TILE_WIDTH =
  (PIANO_WIDTH / Object.keys(KEYBOARD_NOTES_MAPPING).length) * 2;
const TILE_HEIGHT = 1;
const BLACK_TILE_HEIGHT = TILE_HEIGHT / 1.7;

const DEFAULT_TILE_ROTATION = 0.0;
const MAX_TILE_ROTATION = 0.1;
const TILE_ROTATION_STEP = 0.05;

const MAX_SHARP_ROTATION = 0.03;
const SHARP_ROTATION_STEP = 0.01;
const CAMERA_X = 0.28;
const TILE_COLOR = 0xffe4c4;
const SHARP_TILE_COLOR = 0x2a2726;
const TILE_PADDING = 0.006;

// === SCENE ELEMENTS

let camera, scene, renderer;
let notesWrapper;

// === GROUP OF TILES

let group = new THREE.Group();

// === BUSINESS

let resizeTimeout = null;
let notesWrapperTimeout = null;
const keyboardEvents = {};

const init = () => {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10,
  );
  camera.position.set(CAMERA_X, 0, 1);

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
      document.querySelector('#hint-wrapper').style.opacity = '0';

      handlePressedKeyboardEvent(event.key);
      console.log(event.key);

      refreshNotesText();
    },
    false,
  );

  window.addEventListener(
    'keyup',
    event => {
      keyboardEvents[event.key] = false;

      if (Object.values(keyboardEvents).some(k => k)) refreshNotesText();
    },
    false,
  );

  window.addEventListener('resize', updateViewportSize);
  updateViewportSize();

  document.body.appendChild(renderer.domElement);

  //  create notes group
  group.position.set(-PIANO_WIDTH / 2, 0, -PIANO_HEIGHT / 2);
  let geometry = new THREE.BoxGeometry(TILE_WIDTH, TILE_HEIGHT, 0.1);
  let geometrySharpTile = new THREE.BoxGeometry(
    TILE_WIDTH,
    BLACK_TILE_HEIGHT,
    0.1,
  );

  geometry.translate(0, -TILE_HEIGHT / 2, 0);
  geometrySharpTile.translate(0, -BLACK_TILE_HEIGHT / 2, 0);

  let position = 0;

  Object.keys(KEYBOARD_NOTES_MAPPING).forEach(k => {
    let material = new THREE.MeshLambertMaterial({
      color: KEYBOARD_NOTES_MAPPING[k].note.sharp
        ? SHARP_TILE_COLOR
        : TILE_COLOR,
      vertexColors: THREE.FaceColors,
    });
    let tile = new THREE.Mesh(
      KEYBOARD_NOTES_MAPPING[k].note.sharp ? geometrySharpTile : geometry,
      material,
    );
    if (KEYBOARD_NOTES_MAPPING[k].note.sharp) {
      tile.position.set(position + TILE_WIDTH / 2, 0.62, 0.13);
    } else {
      position += TILE_WIDTH + TILE_PADDING;
      tile.position.set(position, 0.6, 0.1);
    }
    KEYBOARD_NOTES_MAPPING[k].tile = tile;
    group.add(tile);
  });

  group.rotation.set(-0.7, 0, 0);
  scene.add(group);

  const pointlight = new THREE.PointLight(0xffffff, 1.2, 100);
  pointlight.position.set(CAMERA_X, 0, 2);
  scene.add(pointlight);

  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('mouseup', onMouseUp);
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

  keyboardEvents[k] = true;
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
    if (!KEYBOARD_NOTES_MAPPING[k]) continue;

    const maxRot = KEYBOARD_NOTES_MAPPING[k].note.sharp
      ? MAX_SHARP_ROTATION
      : MAX_TILE_ROTATION;
    const rotStep = KEYBOARD_NOTES_MAPPING[k].note.sharp
      ? SHARP_ROTATION_STEP
      : TILE_ROTATION_STEP;

    if (keyboardEvents[k]) {
      if (KEYBOARD_NOTES_MAPPING[k].tile.rotation.x < maxRot)
        KEYBOARD_NOTES_MAPPING[k].tile.rotation.x += rotStep;
      if (KEYBOARD_NOTES_MAPPING[k].tile.rotation.x > maxRot)
        KEYBOARD_NOTES_MAPPING[k].tile.rotation.x = maxRot;
    } else {
      if (KEYBOARD_NOTES_MAPPING[k].tile.rotation.x > DEFAULT_TILE_ROTATION)
        KEYBOARD_NOTES_MAPPING[k].tile.rotation.x -= rotStep;
      if (KEYBOARD_NOTES_MAPPING[k].tile.rotation.x < DEFAULT_TILE_ROTATION)
        KEYBOARD_NOTES_MAPPING[k].tile.rotation.x = DEFAULT_TILE_ROTATION;
    }
  }

  // rendering after mesh changes
  renderer.render(scene, camera);
};

function getClosestTile(position) {
  // update the position
  raycaster.setFromCamera(position, camera);
  // Get list of intersections
  var selected = raycaster.intersectObjects(group.children);
  if (selected.length) {
    return selected[0].object;
  }
}

function onMouseDown(event) {
  var position = new THREE.Vector2();
 
  var domRect = renderer.domElement.getBoundingClientRect();
  position.x = (event.clientX / domRect.width) * 2 - 1 + domRect.left;
  position.y = - (event.clientY / domRect.height) * 2 + 1 + domRect.top;

  var s = getClosestTile(position);
  if (s) {

    const index = Object.values(KEYBOARD_NOTES_MAPPING).findIndex(v => v.tile === s);
    
    handlePressedKeyboardEvent(Object.keys(KEYBOARD_NOTES_MAPPING)[index]);
    lastTileClicked = index;
    
    refreshNotesText();
  }
}

function onMouseUp(event) {

  keyboardEvents[Object.keys(KEYBOARD_NOTES_MAPPING)[lastTileClicked]] = false;

  if (Object.values(keyboardEvents).some(k => k)) refreshNotesText();

}

const refreshNotesText = () => {
  clearTimeout(notesWrapperTimeout);

  notesWrapper.innerHTML = '';
  notesWrapper.style.opacity = '1';

  for (let k of Object.keys(keyboardEvents)) {
    if (keyboardEvents[k] && KEYBOARD_NOTES_MAPPING[k]) {
      notesWrapper.innerHTML += `<h2>&nbsp;${KEYBOARD_NOTES_MAPPING[k].note.note}<sup>${KEYBOARD_NOTES_MAPPING[k].note.frequency}</sup>&nbsp;</h2>`;
    }
  }

  notesWrapperTimeout = setTimeout(() => {
    notesWrapper.style.opacity = '0';
  }, 1000);
};

const gameLoop = () => {
  requestAnimationFrame(gameLoop);

  handleRepetitiveKeyboardEvents();
};

// ========== //

init();
renderer.render(scene, camera);

gameLoop();

// ========== //

window.onload = () => {
  setTimeout(() => {
    document.querySelector('#hint-wrapper').style.opacity = '1';
  }, 1000);

  notesWrapper = document.querySelector('#notes-wrapper');
};
