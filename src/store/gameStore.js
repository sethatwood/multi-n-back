import { defineStore } from 'pinia';
import stimulusSound from '../assets/stimulus.wav';

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
      color: false,
      emoji: false,
      position: false,
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
      { color: 'purple', emoji: 'fire', position: 'left', shape: 'circle' }, // no match
      { color: 'blue', emoji: 'flower', position: 'center', shape: 'square' }, // no match
      { color: 'blue', emoji: 'ice', position: 'left', shape: 'triangle' }, // position match
      { color: 'blue', emoji: 'fire', position: 'right', shape: 'circle' }, // color match
      { color: 'purple', emoji: 'ice', position: 'right', shape: 'triangle' }, // shape, emoji match
      { color: 'purple', emoji: 'flower', position: 'left', shape: 'square' }, // no match
      { color: 'purple', emoji: 'fire', position: 'center', shape: 'triangle' }, // color, shape match
      { color: 'green', emoji: 'fire', position: 'center', shape: 'circle' }, // no match
      { color: 'blue', emoji: 'flower', position: 'right', shape: 'square' }, // no match
      { color: 'green', emoji: 'fire', position: 'center', shape: 'circle' }, // position, color, shape, emoji match
      { color: 'blue', emoji: 'ice', position: 'center', shape: 'triangle' }, // color match
      { color: 'green', emoji: 'flower', position: 'right', shape: 'triangle' }, // color match
    ],
    stimulusSound: new Audio(stimulusSound),
  }),
  actions: {
    generateRandomStimulus() {
      const colors = ['purple', 'green', 'blue'];
      const emojis = ['fire', 'ice', 'flower'];
      const positions = ['left', 'center', 'right'];
      const shapes = ['circle', 'square', 'triangle'];

      const stimulus = {
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        position: positions[Math.floor(Math.random() * positions.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
      // console.log("Generated random stimulus:", stimulus);
      return stimulus;
    },
    setNewStimulus() {
      if (this.isPaused) {
        console.log("Game is paused. Skipping setNewStimulus.");
        return;
      }

      this.respondedThisTurn = {
        color: false,
        emoji: false,
        position: false,
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

        const colorMatch = nBackStimulus.color === this.currentStimulus.color;
        const emojiMatch = nBackStimulus.emoji === this.currentStimulus.emoji;
        const positionMatch = nBackStimulus.position === this.currentStimulus.position;
        const shapeMatch = nBackStimulus.shape === this.currentStimulus.shape;

        potentialMatches += colorMatch ? 1 : 0;
        potentialMatches += emojiMatch ? 1 : 0;
        potentialMatches += positionMatch ? 1 : 0;
        potentialMatches += shapeMatch ? 1 : 0;

        this.previousPotentialCorrectAnswers += potentialMatches;

        console.log("Updated `previousPotentialCorrectAnswers`:", this.previousPotentialCorrectAnswers);
        console.log("Potential match details:", { positionMatch, colorMatch, shapeMatch, emojiMatch });
      }

      this.stimulusHistory.push({ ...this.currentStimulus });
      console.log("Setting new stimulus:", { ...this.currentStimulus });
      this.flashBorder = true;
      this.stimulusSound.play();
      setTimeout(() => {
        this.flashBorder = false;
      }, 300);
    },
    toggleDeterministicMode() {
      this.isDeterministic = !this.isDeterministic;
      console.log(`Deterministic mode toggled. Now: ${this.isDeterministic}`);
      this.startGame();
    },
    resetGameState() {
      console.log("Resetting game state");
      clearInterval(this.timer);
      this.score = 0;
      this.incorrectResponses = 0;
      this.timeLeft = 5;
      this.isPaused = false;
      this.stimulusHistory = [];
      this.potentialCorrectAnswers = 0;
      this.previousPotentialCorrectAnswers = 0;
      this.respondedThisTurn = {
        color: false,
        emoji: false,
        position: false,
        shape: false,
      };
      this.deterministicIndex = 0;
      this.setNewStimulus();
    },
    startGame() {
      console.log("Starting game");
      this.resetGameState();
      this.timer = setInterval(() => {
        // console.log(`Timer tick. Time left: ${this.timeLeft}`);
        if (this.timeLeft > 1) {
            this.timeLeft -= 1;
        } else {
            this.setNewStimulus();
            this.timeLeft = 5;
        }
      }, 1000);
    },
    stopGame() {
      console.log("Stopping game");
      clearInterval(this.timer);
      this.isPaused = true;
    },
    respondToStimulus(stimulusType) {
      console.log(`Responding to stimulus: ${stimulusType}`);
      const nBackIndex = this.stimulusHistory.length - this.nBack - 1;
      console.log(`nBackIndex: ${nBackIndex}`);

      if (nBackIndex >= 0) {
        const nBackStimulus = this.stimulusHistory[nBackIndex];
        console.log("Comparing current stimulus and n-back stimulus", {current: this.currentStimulus, nBack: nBackStimulus});

        const isCorrect = (
          stimulusType === 'color' && this.currentStimulus.color === nBackStimulus.color ||
          stimulusType === 'emoji' && this.currentStimulus.emoji === nBackStimulus.emoji ||
          stimulusType === 'position' && this.currentStimulus.position === nBackStimulus.position ||
          stimulusType === 'shape' && this.currentStimulus.shape === nBackStimulus.shape
        );

        console.log("Is response correct:", isCorrect);

        if (isCorrect) {
          this.score += 1;
          // play sound
        } else {
          this.score -= 1;
          //play sound
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
        console.log(`Response is ${isCorrect ? 'correct' : 'incorrect'}. Score: ${this.score}`);
      } else {
        console.log("Not enough turns have passed to respond.");
      }
      this.respondedThisTurn[stimulusType] = true;
    },
  },
});
