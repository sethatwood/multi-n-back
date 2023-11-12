import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    score: 0,
    level: 1,
    timeLeft: 5,
    currentStimulus: {
      position: 'left',
      color: 'purple',
      shape: 'circle'
    },
    stimulusHistory: [], // Keep track of past stimuli
    timer: null,
    flashBorder: false,
  }),
  actions: {
    incrementScore() {
      this.score += 1;
      console.log("Score incremented:", this.score);
    },
    setNewStimulus() {
      // Logic to randomly set position, color, and shape
      const newStimulus = {
        position: Math.random() < 0.5 ? 'left' : 'right',
        color: Math.random() < 0.5 ? 'purple' : 'green',
        shape: Math.random() < 0.5 ? 'circle' : 'square',
      };
      this.currentStimulus = newStimulus;
      this.stimulusHistory.push(newStimulus);
      console.log("New Stimulus set:", this.currentStimulus);
      this.flashBorder = true;
      // Reset flashBorder after a short delay
      setTimeout(() => {
        this.flashBorder = false;
      }, 300); // delay can be adjusted
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
      console.log("Game started");
    },
    stopGame() {
      clearInterval(this.timer);
      this.timer = null;
      console.log("Game stopped");
    },
  },
});
