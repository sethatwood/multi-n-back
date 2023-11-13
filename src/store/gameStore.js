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
    respondedThisTurn: {
      position: false,
      color: false,
      shape: false,
    },
  }),
  actions: {
    setNewStimulus() {
      // Reset response locks for the new turn
      this.respondedThisTurn = {
        position: false,
        color: false,
        shape: false,
      };
      const newStimulus = {
        position: Math.random() < 0.5 ? 'left' : 'right',
        color: Math.random() < 0.5 ? 'purple' : 'green',
        shape: Math.random() < 0.5 ? 'circle' : 'square',
      };
      this.currentStimulus = newStimulus;
      this.stimulusHistory.push(newStimulus);
      console.log("New Stimulus:", newStimulus);
      this.flashBorder = true;
      setTimeout(() => {
        this.flashBorder = false;
      }, 300);
    },
    respondToStimulus(stimulusType) {
      console.log("Responding to stimulus type:", stimulusType);
      const nBackIndex = this.stimulusHistory.length - this.nBack - 1;
      console.log("nBackIndex:", nBackIndex);

      if (nBackIndex >= 0) {
        const nBackStimulus = this.stimulusHistory[nBackIndex];
        console.log("Current Stimulus:", this.currentStimulus);
        console.log("N-Back Stimulus:", nBackStimulus);

        const isCorrect = (
          stimulusType === 'position' && this.currentStimulus.position === nBackStimulus.position ||
          stimulusType === 'color' && this.currentStimulus.color === nBackStimulus.color ||
          stimulusType === 'shape' && this.currentStimulus.shape === nBackStimulus.shape
        );

        console.log("Is response correct:", isCorrect);

        if (isCorrect) {
          this.score += 1;
          console.log("Correct response. Score incremented to:", this.score);
        } else {
          this.score -= 1;
          console.log("Incorrect response. Score decremented to:", this.score);
        }
      } else {
        console.log("Not enough turns have passed to respond.");
      }
      // Mark this stimulus type as responded for this turn
      this.respondedThisTurn[stimulusType] = true;
    },
    startGame() {
      console.log("Starting game");
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
      console.log("Game stopped");
    },
  },
});
