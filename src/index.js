// === RAYCASTER INIT

let raycaster = new THREE.Raycaster();
let lastTileClicked = null;

// === TILE SIZE

const PIANO_WIDTH = (window.innerWidth * 8) / 10 / (window.innerWidth / 2);
const PIANO_HEIGHT = 1;
const TILE_WIDTH = (PIANO_WIDTH / NOTES.length) * 2;
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

let camera, scene, renderer, fontLoader;
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
  fontLoader = new THREE.FontLoader();

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

      refreshNotesText();

      event.preventDefault();
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

  fontLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json',
    function(font) {
      for (const note of NOTES) {
        const material = new THREE.MeshLambertMaterial({
          color: note.sharp ? SHARP_TILE_COLOR : TILE_COLOR,
          vertexColors: THREE.FaceColors,
        });
        const tile = new THREE.Mesh(
          note.sharp ? geometrySharpTile : geometry,
          material,
        );

        const textGeometry = new THREE.TextGeometry(note.shortcut.slice(0, 2), {
          font,
          size: 0.03,
          height: 0.005,
        });
        const textMaterial = new THREE.MeshPhongMaterial({
          color: note.sharp ? TILE_COLOR : SHARP_TILE_COLOR,
          specular: 0xffffff,
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.rotation.x = 0.4;

        if (note.sharp) {
          text.position.set(position + TILE_WIDTH / 2 - 0.02, 0.1, 0.19);
          tile.position.set(position + TILE_WIDTH / 2, 0.62, 0.14);
        } else {
          position += TILE_WIDTH + TILE_PADDING;
          text.position.set(position - 0.02, -0.35, 0.16);
          tile.position.set(position, 0.6, 0.1);
        }

        note.tile = tile;
        note.text = text;

        group.add(text);
        group.add(tile);
      }

      group.rotation.set(-0.7, 0, 0);
      scene.add(group);

      const pointlight = new THREE.PointLight(0xffffff, 1.2, 100);
      pointlight.position.set(CAMERA_X, 0, 2);
      scene.add(pointlight);

      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
    },
  );
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

  NOTES.forEach(note => {
    if (keyboardEvents[note.shortcut]) {
      frequencies.push(note.frequency);
    }
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
  if (keyboardEvents[k] || !NOTES.some(note => note.shortcut === k)) {
    return;
  }

  keyboardEvents[k] = true;
  const note = NOTES.find(note => note.shortcut === k);

  if (!note.paused) {
    note.pause();
    note.currentTime = 0.0;
  }

  note.play();
  updateCanvasBackground();
};

const handleRepetitiveKeyboardEvents = () => {
  // handling tile rotation on playing
  for (let k of Object.keys(keyboardEvents)) {
    const note = NOTES.find(note => note.shortcut === k);

    if (!note) continue;

    const maxRot = note.sharp ? MAX_SHARP_ROTATION : MAX_TILE_ROTATION;
    const rotStep = note.sharp ? SHARP_ROTATION_STEP : TILE_ROTATION_STEP;

    if (keyboardEvents[k]) {
      if (note.tile.rotation.x < maxRot) note.tile.rotation.x += rotStep;
      if (note.tile.rotation.x > maxRot) note.tile.rotation.x = maxRot;
    } else {
      if (note.tile.rotation.x > DEFAULT_TILE_ROTATION)
        note.tile.rotation.x -= rotStep;
      if (note.tile.rotation.x < DEFAULT_TILE_ROTATION)
        note.tile.rotation.x = DEFAULT_TILE_ROTATION;
    }
  }

  // rendering after mesh changes
  renderer.render(scene, camera);
};

function getClosestTile(position) {
  // update the position
  raycaster.setFromCamera(position, camera);
  // Get list of intersections
  const selected = raycaster.intersectObjects(group.children);
  if (selected.length) {
    return selected[0].object;
  }
}

function onMouseDown(event) {
  const position = new THREE.Vector2();

  const domRect = renderer.domElement.getBoundingClientRect();
  position.x = (event.clientX / domRect.width) * 2 - 1 + domRect.left;
  position.y = -(event.clientY / domRect.height) * 2 + 1 + domRect.top;

  document.querySelector('#hint-wrapper').style.opacity = '0';

  const tile = getClosestTile(position);
  if (tile) {
    const index = NOTES.findIndex(v => v.tile === tile);

    handlePressedKeyboardEvent(NOTES[index].shortcut);
    lastTileClicked = index;

    refreshNotesText();
  }
}

function onMouseUp(event) {
  keyboardEvents[NOTES.map(note => note.shortcut)[lastTileClicked]] = false;

  if (Object.values(keyboardEvents).some(k => k)) refreshNotesText();
}

const refreshNotesText = () => {
  clearTimeout(notesWrapperTimeout);

  notesWrapper.innerHTML = '';
  notesWrapper.style.opacity = '1';

  for (let k of Object.keys(keyboardEvents)) {
    const note = NOTES.find(note => note.shortcut === k);

    if (keyboardEvents[k] && note) {
      notesWrapper.innerHTML += `<h2>&nbsp;${note.note}<sup>${note.frequency}</sup>&nbsp;</h2>`;
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
