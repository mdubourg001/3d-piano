export class Note extends Audio {
  /**
   * @param {string} soundPath - path of the audio file
   * @param {string} note - name of the note
   * @param {string} color - associated hexadecimal color
   */
  constructor(soundPath, note, color) {
    super(soundPath);

    this.note = note;
    this.color = color;
  }
}

/** @type {Array<Note>} */
export default [];
