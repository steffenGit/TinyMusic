"use strict";
import {Instrument} from "./tinyinstrument.js";
import {Note} from "./tinymusic.js";

export class Song {


  constructor(ac, str, instruments, analyzerNode) {
    instruments = instruments || INSTRUMENTS;
    console.log(instruments[0]);
    this.ac = ac;
    let tokens = str.split('|');

    this.bpm = parseInt(tokens[1]);
    this.instruments = [];
    let ins = {};
    let notes = tokens[2].split(';')
        .filter((ele) => ele !== '')
        .map((ele) => {
          let ele2 = ele.split(' ');
          let n = new Note(parseFloat(ele2[0]), ele2[1], parseFloat(ele2[2]), ele2[3]);
          if(!ins[n.instrument])ins[n.instrument] = new Instrument(this.ac, this.bpm, instruments[n.instrument], analyzerNode);
          ins[n.instrument].addNote(n);
          return n;
        });
    for(let i in ins) {
      this.instruments.push(ins[i].setup());
    }
  };


  play() {
    let time = this.ac.currentTime;
    this.instruments.forEach(s => s.play(time));
  }

  stop() {
    this.instruments.forEach(s => s.stop());
  }
}

const INSTRUMENTS = {
  0: {
    smoothing: 0,
    staccato: 0.2,
    gain: 0.01,
    bass: 100,
    mid: 1000,
    treble: 2500,
    waveType: 'square',
    customWave: {
      real: [],
      imaginary: []
    }
  }
};

