import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    // Define your game's state here
    score: 0,
    level: 1,
    // Add other states as needed
  }),
  getters: {
    // Define any getters here
  },
  actions: {
    // Define any actions here
    incrementScore() {
      this.score += 1;
    },
    // Add other actions as needed
  },
});
