class Note extends Audio {
  /**
   * @param {string} soundPath - path of the audio file
   * @param {string} note - name of the note
   * @param {string} color - associated hexadecimal color
   * @param {number} frequency - frequency of the note in Hertz
   * @param {boolean} sharp - is the note a sharp
   */
  constructor(soundPath, note, color, frequency, sharp = false) {
    super(soundPath);

    this.note = note;
    this.color = color;
    this.frequency = frequency;
  }
}

/** @type {Array<Note>} */
const NOTES = [
  //new Note("../media/220-A.mp3", "A²²⁰", "", 220),
  //new Note("../media/246-B.mp3", "B²⁴⁶", "", 246)
  new Note('../media/261-C.mp3', 'C²⁶¹', '', 261),
  new Note('../media/277-C-sharp.mp3', 'C#²⁷⁷', '', 277, true),
  new Note('../media/293-D.mp3', 'D²⁹³', '', 293),
  new Note('../media/311-D-sharp.mp3', 'D#³¹¹', '', 311, true),
  new Note('../media/329-E.mp3', 'E³²⁹', '', 329),
  new Note('../media/349-F.mp3', 'F³⁴⁹', '', 349),
  new Note('../media/369-F-sharp.mp3', 'F#³⁶⁹', '', 369, true),
  new Note('../media/391-G.mp3', 'G³⁹¹', '', 391),
  new Note('../media/415-G-sharp.mp3', 'G#⁴¹⁵', '', 415, true),
  new Note('../media/440-A.mp3', 'A⁴⁴⁰', '', 440),
  new Note('../media/466-A-sharp.mp3', 'A#⁴⁶⁶', '', 466, true),
  new Note('../media/495-B.mp3', 'B⁴⁹⁵', '', 495),
];
