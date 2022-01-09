class Note extends Audio {
  /**
   * @param {string} soundPath - path of the audio file
   * @param {string} note - name of the note
   * @param {string} color - associated hexadecimal color
   * @param {number} frequency - frequency of the note in Hertz
   * @param {string} shortcut - keyboard shortcut to play the note
   * @param {boolean} sharp - is the note a sharp
   */
  constructor(soundPath, note, frequency, shortcut, sharp = false) {
    super(soundPath);

    this.note = note;
    this.frequency = frequency;
    this.shortcut = shortcut;
    this.sharp = sharp;
  }
}

const isAzerty = (navigator.language || navigator.userLanguage) === 'fr';

/** @type {Array<Note>} */
const NOTES = [
  // first octave
  new Note('../media/261-C.mp3', 'C', 261, 'Tab'),
  new Note('../media/277-C-sharp.mp3', 'C#', 277, isAzerty ? '&' : '1', true),
  new Note('../media/293-D.mp3', 'D', 293, isAzerty ? 'a' : 'q'),
  new Note('../media/311-D-sharp.mp3', 'D#', 311, isAzerty ? 'é' : '2', true),
  new Note('../media/329-E.mp3', 'E', 329, isAzerty ? 'z' : 'w'),
  new Note('../media/349-F.mp3', 'F', 349, 'e'),
  new Note('../media/369-F-sharp.mp3', 'F#', 369, isAzerty ? `'` : '4', true),
  new Note('../media/391-G.mp3', 'G', 391, 'r'),
  new Note('../media/415-G-sharp.mp3', 'G#', 415, isAzerty ? '(' : '5', true),
  new Note('../media/440-A.mp3', 'A', 440, 't'),
  new Note('../media/466-A-sharp.mp3', 'A#', 466, isAzerty ? '§' : '6', true),
  new Note('../media/495-B.mp3', 'B', 495, 'y'),
  // second octave
  new Note('../media/523-C.mp3', 'C', 523, 'u'),
  new Note('../media/545-C-sharp.mp3', 'C#', 545, isAzerty ? '!' : '8', true),
  new Note('../media/587-D.mp3', 'D', 587, 'i'),
  new Note('../media/622-D-sharp.mp3', 'D#', 622, isAzerty ? 'ç' : '9', true),
  new Note('../media/659-E.mp3', 'E', 659, 'o'),
  new Note('../media/698-F.mp3', 'F', 698, 'p'),
  new Note('../media/739-F-sharp.mp3', 'F#', 739, isAzerty ? ')' : '-', true),
  new Note('../media/783-G.mp3', 'G', 783, isAzerty ? '^' : '['),
  new Note('../media/830-G-sharp.mp3', 'G#', 830, isAzerty ? '-' : '=', true),
  new Note('../media/880-A.mp3', 'A', 880, isAzerty ? '$' : ']'),
  new Note('../media/932-A-sharp.mp3', 'A#', 932, 'Backspace', true),
  new Note('../media/987-B.mp3', 'B', 987, 'Enter'),
  // third octave
  // new Note('../media/1046-C.mp3', 'C', 1046, ''),
];
