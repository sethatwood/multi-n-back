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
    potentialCorrectAnswers: 0,
    previousPotentialCorrectAnswers: 0,
    highScore: Number(localStorage.getItem('highScore')) || 0,
    highScoreData: JSON.parse(localStorage.getItem('highScoreData')) || { score: 0, potentialCorrectAnswers: 0 },
    isDeterministic: false,
    isPaused: false,
    deterministicIndex: 0,
    deterministicStimuli: [
      { position: 'left', color: 'purple', shape: 'circle' }, // no match
      { position: 'center', color: 'blue', shape: 'square' }, // no match
      { position: 'left', color: 'blue', shape: 'triangle' }, // position match
      { position: 'right', color: 'blue', shape: 'circle' }, // color match
      { position: 'right', color: 'purple', shape: 'triangle' }, // shape match
      { position: 'left', color: 'purple', shape: 'square' }, // no match
      { position: 'center', color: 'purple', shape: 'triangle' }, // color, shape match
      { position: 'center', color: 'green', shape: 'circle' }, // no match
      { position: 'right', color: 'blue', shape: 'square' }, // no match
      { position: 'center', color: 'green', shape: 'circle' }, // position, color, shape match
      { position: 'center', color: 'blue', shape: 'triangle' }, // color match
      { position: 'right', color: 'green', shape: 'triangle' }, // color match
    ],
  }),
  actions: {
    setNewStimulus() {
      if (this.isPaused) return; // Skip setting new stimulus if paused

      this.respondedThisTurn = {
        position: false,
        color: false,
        shape: false,
      };

      this.potentialCorrectAnswers = this.previousPotentialCorrectAnswers;

      if (this.isDeterministic) {
        // Use deterministic stimuli
        this.currentStimulus = this.deterministicStimuli[this.deterministicIndex];
        this.deterministicIndex = (this.deterministicIndex + 1) % this.deterministicStimuli.length;
      } else {
        // Regular random stimulus logic
        const positions = ['left', 'center', 'right'];
        const colors = ['purple', 'green', 'blue'];
        const shapes = ['circle', 'square', 'triangle'];

        this.currentStimulus = {
          position: positions[Math.floor(Math.random() * positions.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        };
      }

      // Increase potential correct answers after enough history is available
      if (this.stimulusHistory.length >= this.nBack) {
        const nBackStimulus = this.stimulusHistory[this.stimulusHistory.length - this.nBack];
        let potentialMatches = 0;

        potentialMatches += nBackStimulus.position === this.currentStimulus.position ? 1 : 0;
        potentialMatches += nBackStimulus.color === this.currentStimulus.color ? 1 : 0;
        potentialMatches += nBackStimulus.shape === this.currentStimulus.shape ? 1 : 0;

        this.previousPotentialCorrectAnswers += potentialMatches;
      }

      this.stimulusHistory.push({ ...this.currentStimulus });
      console.log("New Stimulus:", { ...this.currentStimulus });
      this.flashBorder = true;
      setTimeout(() => {
        this.flashBorder = false;
      }, 300);
    },
    toggleDeterministicMode() {
      this.isDeterministic = !this.isDeterministic;
    },
    togglePause() {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        clearInterval(this.timer);
      } else {
        this.startGame();
      }
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
          if (this.score > this.highScoreData.score) {
            this.highScoreData = {
              score: this.score,
              potentialCorrectAnswers: this.potentialCorrectAnswers
            };
            localStorage.setItem('highScoreData', JSON.stringify(this.highScoreData));
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
