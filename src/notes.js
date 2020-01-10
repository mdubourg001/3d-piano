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
    this.color = `#${hexColorFromString(frequency.toString(), '1046', '261')}`;
    this.frequency = frequency;
    this.sharp = sharp;
  }
}

/** @type {Array<Note>} */
const NOTES = [
  //new Note("../media/220-A.mp3", "A²²⁰", "", 220),
  //new Note("../media/246-B.mp3", "B²⁴⁶", "", 246)
  // first octave
  new Note('../media/261-C.mp3', 'C²⁶¹', '#33e3ff', 261),
  new Note('../media/277-C-sharp.mp3', 'C#²⁷⁷', '#33afff', 277, true),
  new Note('../media/293-D.mp3', 'D²⁹³', '#338dff', 293),
  new Note('../media/311-D-sharp.mp3', 'D#³¹¹', '#3364ff', 311, true),
  new Note('../media/329-E.mp3', 'E³²⁹', '#3333ff', 329),
  new Note('../media/349-F.mp3', 'F³⁴⁹', '#5833ff', 349),
  new Note('../media/369-F-sharp.mp3', 'F#³⁶⁹', '#8633ff', 369, true),
  new Note('../media/391-G.mp3', 'G³⁹¹', '#a233ff', 391),
  new Note('../media/415-G-sharp.mp3', 'G#⁴¹⁵', '#c733ff', 415, true),
  new Note('../media/440-A.mp3', 'A⁴⁴⁰', '#ec33ff', 440),
  new Note('../media/466-A-sharp.mp3', 'A#⁴⁶⁶', '#ff33f3', 466, true),
  new Note('../media/495-B.mp3', 'B⁴⁹⁵', '#ff33ca', 495),
  // second octave
  new Note('../media/523-C.mp3', 'C⁵²³', '#ff33ac', 523),
  new Note('../media/545-C-sharp.mp3', 'C#⁵⁴⁵', '#ff338a', 545, true),
  new Note('../media/587-D.mp3', 'D⁵⁸⁷', '#ff3371', 587),
  new Note('../media/622-D-sharp.mp3', 'D#⁶²²', '#ff3358', 622, true),
  new Note('../media/659-E.mp3', 'E⁶⁵⁹', '#ff3933', 659),
  new Note('../media/698-F.mp3', 'F⁶⁹⁸', '#ff5e33', 698),
  new Note('../media/739-F-sharp.mp3', 'F#⁷³⁹', '#ff8633', 739, true),
  new Note('../media/783-G.mp3', 'G⁷⁸³', '#ffb533', 783),
  new Note('../media/830-G-sharp.mp3', 'G#⁸³⁰', '#ffda33', 830, true),
  new Note('../media/880-A.mp3', 'A⁸⁸⁰', '#f6ff33', 880),
  new Note('../media/932-A-sharp.mp3', 'A#⁹³²', '#c7ff33', 932, true),
  new Note('../media/987-B.mp3', 'B⁹⁸⁷', '#9fff33', 987),
  // third octave
  new Note('../media/1046-C.mp3', 'C¹⁰⁴⁶', '#7aff33', 1046),
];
