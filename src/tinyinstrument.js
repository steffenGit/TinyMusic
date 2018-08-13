"use strict";

import {Sequence} from "./tinymusic.js";

export class Instrument {
  constructor(audioContext, tempo, settings, analyserNode) {
    this.ac = audioContext;
    this.tempo = tempo;
    this.settings = settings;
    this.notes = [];
    this.sequences = [];
    this.melodies = [];
    this.an = analyserNode;
  }

  static areNotesOverlapping(n1, n2) {
    if (n2.when <= n1.when && n2.when + n2.duration > n1.when) return true;
    if (n2.when + n2.duration > n1.when + n1.duration && n2.when < n1.when + n1.duration) return true;
  }

  addNote(n) {
    this.notes.push(n);
  }

  setup(notes) {
    if(notes) this.notes = notes;
    this.createMelodies();
    this.createSequences();
    return this;
  }

  isNoteCollidingWithMelody(index, note) {
    if (!this.melodies[index])
      this.melodies[index] = [];
    let free = true;
    this.melodies[index].forEach(n => {
      if (Instrument.areNotesOverlapping(n, note)) free = false;
      if (Instrument.areNotesOverlapping(note, n)) free = false;
    });
    return !free;
  }


  createMelodies() {

    this.notes.forEach(n => {
      let currentMelody = 0;
      let free = false;
      while (!free && currentMelody < 5) {
        free = !this.isNoteCollidingWithMelody(currentMelody, n);
        if (free) {
          this.melodies[currentMelody].push(n);
        }
        currentMelody++;
      }
    })
  }


  createSequences() {
    this.melodies.forEach(m => {
      let s = new Sequence(this.ac, this.tempo, m, this.an);
      s.smoothing = this.settings.smoothing;
      s.staccato = this.settings.staccato;
      s.gain.gain.value = this.settings.gain;
      s.bass.gain.value = this.settings.bass;
      s.mid.gain.value = this.settings.mid;
      s.treble.gain.value = this.settings.treble;
      s.waveType = this.settings.waveType;
      if(this.settings.waveType === 'custom') {
        s.createCustomWave(this.settings.customReal, this.settings.customI);
      }
      this.sequences.push(s);
      console.log(s);
    })
  }

  play() {
    let time = this.ac.currentTime;
    this.sequences.forEach(s => s.play(time));
  }

  stop() {
    this.sequences.forEach(s => s.stop());
  }
}