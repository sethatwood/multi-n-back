<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto" id="howToPlayModal">
    <div class="relative top-4 mx-auto p-5 border container shadow-lg rounded-md bg-white">
      <div class="instructions mt-2 px-4">
        <img src="/logo.png" class="rounded-2xl" style="width: 180px; height: 180px; object-fit: contain;"/>
        <h2 class="text-xl font-semibold mt-3">Welcome to Poly N-Back!</h2>
        <p class="text-md mt-2">
          Poly N-Back is a variation of the <a href="https://en.wikipedia.org/wiki/N-back" class="text-blue-500 hover:text-blue-700 underline" target="_blank">N-back</a> memory game designed to improve your cognitive skills.
        </p>
        <div class="border mt-4" />
        <p class="text-md mt-4 font-semibold">
          Here's how you can play:
        </p>
        <p class="text-md mt-2">
          • Click the buttons (Position, Color, Shape) that match the stimuli you saw <strong>{{ gameStore.nBack }}</strong> turns ago. Aim to remember and match each attribute (position, color, shape) as it appears.
        </p>
        <p class="text-md mt-2">
          • Correct responses increase your score. Incorrect responses decrease it and count as a strike.
        </p>
        <p class="text-md mt-2">
          • The game ends if you accumulate 3 strikes. Aim to achieve the highest score possible without hitting 3 strikes.
        </p>
        <p class="text-md mt-2">
          • Your high score is recorded, so you can see your progress over time.
        </p>
      </div>
      <div class="items-center px-4 py-3">
        <button @click="startGame" class="mt-3 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
          Start Game
        </button>
      </div>
      <div class="text-center text-sm py-2 mt-2">
        Built by Human+AI collaboration with 💜
      </div>
    </div>
  </div>
  <div class="container mx-auto px-4 py-5 text-center text-white bg-slate-700">
    <h1 class="text-2xl font-bold mb-5">Poly N-Back</h1>
    <div class="mb-5">
      <p class="text-sm uppercase text-red-500">Strikes: {{ gameStore.incorrectResponses }}</p>
      <p class="text-xl font-bold">{{ gameStore.timeLeft }}</p>
    </div>
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
    <div class="mt-5 text-center">
      <p :class="scoreClass">Score: {{ gameStore.score }}</p>
      <p class="text-sm uppercase text-green-500">High Score: {{ gameStore.highScore }}</p>
      <button v-if="gameStore.incorrectResponses >= 3"
              @click="startGame"
              class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Restart Game
      </button>
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

    return {
      gameStore,
      respond,
      showModal,
      startGame,
      buttonClass,
      scoreClass
    };
  },
};
</script>
