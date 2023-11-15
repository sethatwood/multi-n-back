<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto" id="howToPlayModal">
    <div class="relative mx-auto p-5 border container shadow-lg rounded-md bg-white">
      <IntroContent :n-back="gameStore.nBack" />
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
  <div v-else class="max-w-md mx-auto px-4 py-12 text-center text-white bg-slate-800">
    <div class="mb-5">
      <p class="text-sm uppercase text-red-500">Strikes: {{ gameStore.incorrectResponses }}</p>
      <p class="text-3xl font-bold">{{ gameStore.timeLeft }}</p>
    </div>
    <Stimulus
      class="mb-5"
      :position="gameStore.currentStimulus.position"
      :color="gameStore.currentStimulus.color"
      :shape="gameStore.currentStimulus.shape"
      :emoji="gameStore.currentStimulus.emoji"
      :flashBorder="gameStore.flashBorder"
    />
    <div class="grid grid-cols-2 gap-3">
      <button v-for="button in responseButtons" :key="button.type" class="w-full"
        :disabled="gameStore.respondedThisTurn[button.type]"
        :class="buttonClass(gameStore.respondedThisTurn[button.type])"
        @click="respond(button.type)">
        {{ button.label }}
      </button>
    </div>
    <div class="mt-5 text-center">
      <p class="text-lg font-medium">
        Score: <span :class="scoreClass">{{ gameStore.score }}</span>/{{ gameStore.potentialCorrectAnswers }}
        ({{ calculateAccuracy(gameStore.score, gameStore.potentialCorrectAnswers) }}%)
      </p>
      <p class="text-sm uppercase text-green-700">
        High Score: {{ gameStore.highScoreData.score }}/{{ gameStore.highScoreData.potentialCorrectAnswers }}
        ({{ calculateAccuracy(gameStore.highScoreData.score, gameStore.highScoreData.potentialCorrectAnswers) }}%)
      </p>
      <button v-if="gameStore.incorrectResponses >= 3"
              @click="startGame"
              class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Restart Game
      </button>
    </div>
    <!-- Buttons to toggle deterministic mode and pause the game -->
    <button @click="toggleGame" class="mx-1 mt-6 bg-gray-700 hover:bg-gray-900 text-gray-400 py-1 px-2 rounded">
      {{ gameStore.isPaused ? 'Start' : 'Stop' }} Game
    </button>
    <button
      @click="toggleDeterministicMode"
      class="mx-1 my-1 bg-gray-700 hover:bg-gray-900 text-gray-400 py-1 px-2 rounded"
    >
      {{ gameStore.isDeterministic ? 'Disable' : 'Enable' }} Deterministic
    </button>
    <div
      v-if="gameStore.isDeterministic"
      class="mt-5 text-center text-sm"
    >
      <div v-for="stimulus, index in gameStore.deterministicStimuli" :key="index" class="mt-1">
          {{ gameStore.deterministicIndex - 1 === index ? '->' : '' }}
          {{ stimulus.position }}
          •
          <span :class="colorClass(stimulus.color)">{{ stimulus.color }}</span>
          •
          {{ stimulus.shape }}
          •
          {{ stimulus.emoji }}
          {{ gameStore.deterministicIndex - 1 === index ? '<-' : '' }}
      </div>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch, computed } from 'vue';
import { useGameStore } from './store/gameStore';
import IntroContent from './IntroContent.vue';
import Stimulus from './Stimulus.vue';

export default {
  name: 'App',
  components: {
    IntroContent,
    Stimulus,
  },
  setup() {
    const gameStore = useGameStore();
    const showModal = ref(true);

    const startGame = () => {
      showModal.value = false;
      gameStore.startGame();
    };

    const toggleDeterministicMode = () => {
      gameStore.stopGame();
      gameStore.toggleDeterministicMode();
      gameStore.startGame();
    };

    const toggleGame = () => {
      if (gameStore.isPaused) {
        gameStore.startGame();
      } else {
        gameStore.stopGame();
      }
    };

    onUnmounted(() => {
      gameStore.stopGame();
    });

    const respond = (stimulusType) => {
      gameStore.respondToStimulus(stimulusType);
    };

    const buttonClass = (isDisabled) => {
      return `font-bold p-4 rounded ${
        isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
      }`;
    };

    const previousScore = ref(gameStore.score);

    watch(() => gameStore.score, (newScore, oldScore) => {
      previousScore.value = oldScore;
    });

    const scoreClass = computed(() => {
      return gameStore.score > previousScore.value
        ? 'text-green-500'
        : gameStore.score < previousScore.value
        ? 'text-red-500'
        : 'text-lg font-medium';
    });

    const calculateAccuracy = (score, total) => {
      if (total === 0) return 0;
      return Math.round((score / total) * 100);
    };

    const colorClass = (color) => {
      switch (color) {
        case 'purple': return 'text-purple-500';
        case 'green': return 'text-green-500';
        case 'blue': return 'text-blue-500';
        default: return '';
      }
    };

    const responseButtons = [
      { type: 'position', label: 'Position' },
      { type: 'color', label: 'Color' },
      { type: 'shape', label: 'Shape' },
      { type: 'emoji', label: 'Emoji' }
    ];

    return {
      gameStore,
      respond,
      showModal,
      startGame,
      buttonClass,
      scoreClass,
      calculateAccuracy,
      toggleDeterministicMode,
      toggleGame,
      colorClass,
      responseButtons,
    };
  },
};
</script>
