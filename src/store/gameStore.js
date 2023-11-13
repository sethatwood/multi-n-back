import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    nBack: 2,
    score: 0,
    level: 1,
    timeLeft: 5,
    currentStimulus: {
      position: 'left',
      color: 'purple',
      shape: 'circle'
    },
    stimulusHistory: [],
    timer: null,
    flashBorder: false,
  }),
  actions: {
    setNewStimulus() {
      const newStimulus = {
        position: Math.random() < 0.5 ? 'left' : 'right',
        color: Math.random() < 0.5 ? 'purple' : 'green',
        shape: Math.random() < 0.5 ? 'circle' : 'square',
      };
      this.currentStimulus = newStimulus;
      this.stimulusHistory.push(newStimulus);
      this.flashBorder = true;
      setTimeout(() => {
        this.flashBorder = false;
      }, 300);
    },
    respondToStimulus(stimulusType) {
      const nBackIndex = this.stimulusHistory.length - this.nBack;
      if (nBackIndex >= 0) {
        const nBackStimulus = this.stimulusHistory[nBackIndex];

        // Check if the stimulus type matches the one from N-Back turns ago
        if (stimulusType === 'position' && this.currentStimulus.position === nBackStimulus.position ||
          stimulusType === 'color' && this.currentStimulus.color === nBackStimulus.color ||
          stimulusType === 'shape' && this.currentStimulus.shape === nBackStimulus.shape) {
          this.score += 1;
          console.log("Correct response. Score:", this.score);
        } else {
          this.score -= 1;
          console.log("Incorrect response. Score:", this.score);
        }
      }
    },
    startGame() {
      this.setNewStimulus();
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timeLeft = 5;
          this.setNewStimulus();
        }
      }, 1000);
    },
    stopGame() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
});
