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
        :disabled="gameStore.respondedThisTurn.position"
        :class="buttonClass(gameStore.respondedThisTurn.position)"
        @click="respond('position')">
        Position
      </button>
      <button
        :disabled="gameStore.respondedThisTurn.color"
        :class="buttonClass(gameStore.respondedThisTurn.color)"
        @click="respond('color')">
        Color
      </button>
      <button
        :disabled="gameStore.respondedThisTurn.shape"
        :class="buttonClass(gameStore.respondedThisTurn.shape)"
        @click="respond('shape')">
        Shape
      </button>
    </div>
    <div class="mt-5">
      <p :class="scoreClass">Score: {{ gameStore.score }}</p>
    </div>
    <div class="instructions text-center mt-8 px-4">
      <h2 class="text-xl font-semibold">How to Play</h2>
      <p class="text-sm mt-2">
        Click the buttons (Position, Color, Shape) that match<br>
        the stimuli you saw <strong>{{ gameStore.nBack }}</strong> turns ago.
      </p>
      <p class="text-sm mt-2">
        Correct responses increase your score,<br>
        incorrect responses decrease it.
      </p>
      <p class="text-sm mt-2">
        Aim to remember and match each attribute<br>
        (position, color, shape) as it appears.
      </p>
    </div>
  </div>
</template>

<script>
import { useGameStore } from './store/gameStore';
import Stimulus from './Stimulus.vue';
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';

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

    const buttonClass = (isDisabled) => {
      return `font-bold py-2 px-4 rounded m-2 ${
        isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
      }`;
    };

    const previousScore = ref(gameStore.score);

    watch(() => gameStore.score, (newScore, oldScore) => {
      previousScore.value = oldScore;
    });

    const scoreClass = computed(() => {
      return gameStore.score > previousScore.value
        ? 'text-lg font-medium text-green-500'
        : gameStore.score < previousScore.value
        ? 'text-lg font-medium text-red-500'
        : 'text-lg font-medium';
    });

    return { gameStore, respond, buttonClass, scoreClass };
  },
};
</script>
