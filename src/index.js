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

// === LITE SIZE
const PIANO_WIDTH = (window.innerWidth * 8/10) / (window.innerWidth/2);
const PIANO_HEIGHT = 1;
const TILE_WIDTH = (PIANO_WIDTH) / Object.keys(KEYBOARD_NOTES_MAPPING).length*2;
const TILE_HEIGHT = 1;

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
  camera.position.set(0.15, 0, 1);

  scene = new THREE.Scene()

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
  group.position.set(-PIANO_WIDTH /2, -PIANO_HEIGHT/2, 0);
  let geometry = new THREE.BoxGeometry(TILE_WIDTH, TILE_HEIGHT, 0.1);

  let position = 0;

  Object.keys(KEYBOARD_NOTES_MAPPING).forEach(k => {
    let material = new THREE.MeshBasicMaterial({
      color: KEYBOARD_NOTES_MAPPING[k].note.sharp ? 0x000000 : 0xffe4c4,
      vertexColors: THREE.FaceColors,
    });
    let note = new THREE.Mesh( geometry, material );
    if(KEYBOARD_NOTES_MAPPING[k].note.sharp){
      noteColors(0x0000ff, note);
      note.position.set(position + TILE_WIDTH/2, 1, 0.13);
    }
    else{
      position += TILE_WIDTH+0.01;
      noteColors(0x000000, note);
      note.geometry.faces[6].color = new THREE.Color(0xf0f8ff);
      note.geometry.faces[7].color = new THREE.Color(0xf0f8ff);
      note.position.set(position - TILE_WIDTH, 0.6, 0.1);

    }
    KEYBOARD_NOTES_MAPPING[k].tile = note;
    group.add(note);
  });

  group.rotation.set(-0.7, 0, 0);
  scene.add(group);
};

const noteColors = (color, note) => {
  for(let i=0; i<6; i++){
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

const handleRepetitiveKeyboardEvents = () => {};

const gameLoop = () => {
  requestAnimationFrame(gameLoop);

  handleRepetitiveKeyboardEvents();
};

// ========== //

init();
renderer.render(scene, camera);

gameLoop();
