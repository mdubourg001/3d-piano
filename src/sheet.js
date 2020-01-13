import { Component } from 'preact';

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

// ========== BUSINESS ========== //

openModal = () => {};

closeModal = () => {};

window.onload = () => {};
