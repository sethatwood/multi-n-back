<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="howToPlayModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="instructions text-center mt-2 px-4">
          <h2 class="text-xl font-semibold">How to Play</h2>
          <p class="text-sm mt-2">
            Click the buttons (Position, Color, Shape) that match
            the stimuli you saw <strong>{{ gameStore.nBack }}</strong> turns ago.
          </p>
          <p class="text-sm mt-2">
            Correct responses increase your score,
            incorrect responses decrease it.
          </p>
          <p class="text-sm mt-2">
            Aim to remember and match each attribute
            (position, color, shape) as it appears.
          </p>
        </div>
        <div class="items-center px-4 py-3">
          <button @click="startGame" class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Start Game
          </button>
        </div>
    </div>
  </div>
  <div class="container mx-auto px-4 py-5 text-center text-white bg-slate-700">
    <h1 class="text-2xl font-bold mb-5">Poly N-Back</h1>
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
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { useGameStore } from './store/gameStore';
import Stimulus from './Stimulus.vue';

export default {
  name: 'App',
  components: {
    Stimulus,
  },
  setup() {
    const gameStore = useGameStore();
    const showModal = ref(true);

    const startGame = () => {
      showModal.value = false;
      gameStore.startGame();
    };

    // onMounted(() => {
    //   gameStore.startGame();
    // });

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

    return { gameStore, respond, showModal, startGame, buttonClass, scoreClass };
  },
};
</script>
