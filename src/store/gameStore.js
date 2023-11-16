import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    nBack: 2,
    score: 0,
    level: 1,
    timeLeft: 5,
    currentStimulus: {},
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
    highScoreData: JSON.parse(localStorage.getItem('highScoreData')) || { score: 0, potentialCorrectAnswers: 0 },
    isDeterministic: false,
    isPaused: false,
    deterministicIndex: 0,
    deterministicStimuli: [
      { position: 'left', color: 'purple', shape: 'circle', emoji: 'fire' }, // no match
      { position: 'center', color: 'blue', shape: 'square', emoji: 'flower' }, // no match
      { position: 'left', color: 'blue', shape: 'triangle', emoji: 'ice' }, // position match
      { position: 'right', color: 'blue', shape: 'circle', emoji: 'fire' }, // color match
      { position: 'right', color: 'purple', shape: 'triangle', emoji: 'ice' }, // shape, emoji match
      { position: 'left', color: 'purple', shape: 'square', emoji: 'flower' }, // no match
      { position: 'center', color: 'purple', shape: 'triangle', emoji: 'fire' }, // color, shape match
      { position: 'center', color: 'green', shape: 'circle', emoji: 'fire' }, // no match
      { position: 'right', color: 'blue', shape: 'square', emoji: 'flower' }, // no match
      { position: 'center', color: 'green', shape: 'circle', emoji: 'fire' }, // position, color, shape, emoji match
      { position: 'center', color: 'blue', shape: 'triangle', emoji: 'ice' }, // color match
      { position: 'right', color: 'green', shape: 'triangle', emoji: 'flower' }, // color match
    ],
  }),
  actions: {
    generateRandomStimulus() {
      const positions = ['left', 'center', 'right'];
      const colors = ['purple', 'green', 'blue'];
      const shapes = ['circle', 'square', 'triangle'];
      const emojis = ['fire', 'ice', 'flower'];

      return {
        position: positions[Math.floor(Math.random() * positions.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      };
    },
    setNewStimulus() {
      if (this.isPaused) return;

      this.respondedThisTurn = {
        position: false,
        color: false,
        shape: false,
      };

      this.potentialCorrectAnswers = this.previousPotentialCorrectAnswers;

      if (this.isDeterministic) {
        this.currentStimulus = this.deterministicStimuli[this.deterministicIndex];
        this.deterministicIndex = (this.deterministicIndex + 1) % this.deterministicStimuli.length;
      } else {
        this.currentStimulus = this.generateRandomStimulus();
      }

      // Increase potential correct answers after enough history is available
      if (this.stimulusHistory.length >= this.nBack) {
        const nBackStimulus = this.stimulusHistory[this.stimulusHistory.length - this.nBack];
        let potentialMatches = 0;

        potentialMatches += nBackStimulus.position === this.currentStimulus.position ? 1 : 0;
        potentialMatches += nBackStimulus.color === this.currentStimulus.color ? 1 : 0;
        potentialMatches += nBackStimulus.shape === this.currentStimulus.shape ? 1 : 0;
        potentialMatches += nBackStimulus.emoji === this.currentStimulus.emoji ? 1 : 0;

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
      console.log("Deterministic mode:", this.isDeterministic);
      this.timeLeft = 5;
      this.startGame();
    },
    resetGameState() {
      clearInterval(this.timer);
      this.score = 0;
      this.incorrectResponses = 0;
      this.timeLeft = 5;
      this.isPaused = false;
      this.stimulusHistory = [];
      this.potentialCorrectAnswers = 0;
      this.previousPotentialCorrectAnswers = 0;
      this.respondedThisTurn = { position: false, color: false, shape: false, emoji: false };
      this.deterministicIndex = 0;
      this.setNewStimulus();
    },
    startGame() {
      this.resetGameState();
      this.timer = setInterval(() => {
          if (this.timeLeft > 1) {
              this.timeLeft -= 1; // Decrement timeLeft
          } else {
              this.setNewStimulus(); // Set new stimulus and reset the timer
              this.timeLeft = 5; // Reset the timer
          }
      }, 1000);
      console.log("Starting game");
    },
    stopGame() {
      clearInterval(this.timer);
      this.isPaused = true;
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
          stimulusType === 'shape' && this.currentStimulus.shape === nBackStimulus.shape ||
          stimulusType === 'emoji' && this.currentStimulus.emoji === nBackStimulus.emoji
        );

        console.log("Is response correct:", isCorrect);

        if (isCorrect) {
          this.score += 1;
        } else {
          this.score -= 1;
          this.incorrectResponses += 1;
          if (this.incorrectResponses >= 3) {
            if (this.score > this.highScoreData.score) {
              this.highScoreData = {
                score: this.score,
                potentialCorrectAnswers: this.potentialCorrectAnswers
              };
              localStorage.setItem('highScoreData', JSON.stringify(this.highScoreData));
            }
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
  },
});
