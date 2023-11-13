<template>
  <div class="container mx-auto px-4 py-5 text-center text-white bg-slate-700">
    <h1 class="text-2xl font-bold mb-5">Poly N-Back Game</h1>
    <div class="mb-5">Time Left: {{ gameStore.timeLeft }}s</div>
    <Stimulus
      class="mb-5"
      :position="gameStore.currentStimulus.position"
      :color="gameStore.currentStimulus.color"
      :shape="gameStore.currentStimulus.shape"
      :flashBorder="gameStore.flashBorder"
    />
    <div>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
        @click="respond('position')">
        Position
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
        @click="respond('color')">
        Color
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
        @click="respond('shape')">
        Shape
      </button>
    </div>
    <div class="mt-5">
      <p class="text-lg font-medium text-center">Score: {{ gameStore.score }}</p>
    </div>
  </div>
</template>

<script>
import { useGameStore } from './store/gameStore';
import Stimulus from './Stimulus.vue';
import { onMounted, onUnmounted } from 'vue';

export default {
  name: 'App',
  components: {
    Stimulus,
  },
  setup() {
    const gameStore = useGameStore();

    onMounted(() => {
      gameStore.startGame();
    });

    onUnmounted(() => {
      gameStore.stopGame();
    });

    const respond = (stimulusType) => {
      gameStore.respondToStimulus(stimulusType);
    };

    return { gameStore, respond };
  },
};
</script>
