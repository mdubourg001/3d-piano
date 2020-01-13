import { Component, h, render } from 'preact';
import htm from 'htm';

const html = htm.bind(h);

// ========== CLASSES ========== //

class Sheet {
  /**
   * @param {number} tempo (in b/min)
   * */
  constructor(tempo) {
    this.tempo = tempo;

    this.notes = [];
  }
}

const SheetNoteType = {
  SEMIBREVE: 'SEMIBREVE', // RONDE - 1
  MINIM: 'MINIM', // BLANCHE - 1/2
  CROTCHET: 'CROTCHET', // NOIRE - 1/4
  QUAVER: 'QUAVER', // CROCHE - 1/8
  SEMIQUAVER: 'SEMIQUAVER', // DOUBLECROCHE - 1/16
};

class SheetNote {
  /**
   * @param {Note} note
   * @param {SheetNoteType} type
   * */
  constructor(note, type) {
    this.note = note;
    this.type = type;
  }
}

// ========== COMPONENTS ========== //

class SheetModal extends Component {}

class SheetApp extends Component {
  render() {
    return html`
      <h1>
        Hello World!
        <h1 />
      </h1>
    `;
  }
}

// ========== BUSINESS ========== //

export const initSheet = () => {
  render(
    html`
      <${SheetApp} />
    `,
    document.querySelector('#sheet'),
  );
};
