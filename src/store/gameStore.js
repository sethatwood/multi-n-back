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
    incorrectResponses: 0,
    highScore: Number(localStorage.getItem('highScore')) || 0,
  }),
  actions: {
    setNewStimulus() {
      this.respondedThisTurn = {
        position: false,
        color: false,
        shape: false,
      };

      const positions = ['left', 'center', 'right']; // Updated positions
      const colors = ['purple', 'green', 'blue']; // Updated colors
      const shapes = ['circle', 'square', 'triangle']; // Updated shapes

      const newStimulus = {
        position: positions[Math.floor(Math.random() * positions.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
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
          if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString());
          }
        } else {
          this.score -= 1;
          this.incorrectResponses += 1;
          if (this.incorrectResponses >= 3) {
            this.stopGame();
            alert("Game over! You've reached 3 strikes."); // Consider replacing with a Tailwind modal
          }
        }
      } else {
        console.log("Not enough turns have passed to respond.");
      }
      // Mark this stimulus type as responded for this turn
      this.respondedThisTurn[stimulusType] = true;
    },
    startGame() {
      this.score = 0;
      this.incorrectResponses = 0;
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
