export class Note extends Audio {
  /**
   * @param {string} soundPath - path of the audio file
   * @param {string} note - name of the note
   * @param {number} frequency - frequency of the note in Hertz
   * @param {boolean} sharp - is the note a sharp
   */
  constructor(soundPath, note, frequency, sharp = false) {
    super(soundPath);

    this.note = note;
    this.frequency = frequency;
    this.sharp = sharp;
  }
}

/** @type {Array<Note>} */
export const NOTES = [
  //new Note("../media/220-A.mp3", "A²²⁰", "", 220),
  //new Note("../media/246-B.mp3", "B²⁴⁶", "", 246)
  // first octave
  new Note('./media/261-C.mp3', 'C', 261),
  new Note('./media/277-C-sharp.mp3', 'C#', 277, true),
  new Note('./media/293-D.mp3', 'D', 293),
  new Note('./media/311-D-sharp.mp3', 'D#', 311, true),
  new Note('./media/329-E.mp3', 'E', 329),
  new Note('./media/349-F.mp3', 'F', 349),
  new Note('./media/369-F-sharp.mp3', 'F#', 369, true),
  new Note('./media/391-G.mp3', 'G', 391),
  new Note('./media/415-G-sharp.mp3', 'G#', 415, true),
  new Note('./media/440-A.mp3', 'A', 440),
  new Note('./media/466-A-sharp.mp3', 'A#', 466, true),
  new Note('./media/495-B.mp3', 'B', 495),
  // second octave
  new Note('./media/523-C.mp3', 'C', 523),
  new Note('./media/545-C-sharp.mp3', 'C#', 545, true),
  new Note('./media/587-D.mp3', 'D', 587),
  new Note('./media/622-D-sharp.mp3', 'D#', 622, true),
  new Note('./media/659-E.mp3', 'E', 659),
  new Note('./media/698-F.mp3', 'F', 698),
  new Note('./media/739-F-sharp.mp3', 'F#', 739, true),
  new Note('./media/783-G.mp3', 'G', 783),
  new Note('./media/830-G-sharp.mp3', 'G#', 830, true),
  new Note('./media/880-A.mp3', 'A', 880),
  new Note('./media/932-A-sharp.mp3', 'A#', 932, true),
  new Note('./media/987-B.mp3', 'B', 987),
  // third octave
  //new Note('../media/1046-C.mp3', 'C¹⁰⁴⁶', 1046),
];
