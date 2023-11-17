<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto" id="howToPlayModal">
    <div class="relative mx-auto p-5 border container shadow-lg rounded-md bg-white">
      <IntroContent :n-back="gameStore.nBack" />
      <div class="items-center px-4 py-3">
        <button @click="startGame" class="mt-3 p-4 text-lg bg-blue-800 text-white font-medium rounded-md w-full shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300">
          Start Game
        </button>
      </div>
      <Footer />
    </div>
  </div>
  <div v-else class="max-w-md mx-auto px-4 text-center uppercase text-white bg-slate-800">
    <div v-if="showInstructionMessage" class="my-6 text-center text-gray-400 text-sm cursor-pointer" @click="dismissInstructionMessage">
      &#x24E7; Match attributes from {{ gameStore.nBack }} steps back
    </div>
    <div class="mt-12 mb-3">
      <p class="text-md uppercase text-red-500">Strikes: {{ gameStore.incorrectResponses }}</p>
      <p class="text-3xl font-bold">{{ gameStore.timeLeft }}</p>
    </div>
    <Stimulus
      class="mb-3"
      :color="gameStore.currentStimulus.color"
      :emoji="gameStore.currentStimulus.emoji"
      :position="gameStore.currentStimulus.position"
      :shape="gameStore.currentStimulus.shape"
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
      <p class="text-xl">
        <span class="text-xs text-gray-400">Score: </span>
        <span :class="scoreClass">{{ gameStore.score }}</span>
        <span class="text-sm text-gray-400">
          / {{ gameStore.potentialCorrectAnswers }} ({{ calculateAccuracy(gameStore.score, gameStore.potentialCorrectAnswers) }}%)
        </span>
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
      {{ gameStore.isPaused ? 'Start' : 'End' }} Game
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
    <Footer />
  </div>
</template>

<script>
import { onUnmounted, ref, watch, computed } from 'vue';
import { useGameStore } from './store/gameStore';
import IntroContent from './IntroContent.vue';
import Stimulus from './Stimulus.vue';
import Footer from './Footer.vue';

export default {
  name: 'App',
  components: {
    IntroContent,
    Stimulus,
    Footer,
  },
  setup() {
    const gameStore = useGameStore();
    const showModal = ref(true);
    const showInstructionMessage = ref(!localStorage.getItem('instructionMessageDismissed'));

    const dismissInstructionMessage = () => {
      console.log("Instruction message dismissed");
      showInstructionMessage.value = false;
      localStorage.setItem('instructionMessageDismissed', 'true');
    }

    const startGame = () => {
      console.log("Start game button clicked");
      showModal.value = false;
      gameStore.startGame();
    };

    const toggleDeterministicMode = () => {
      console.log("Toggle deterministic mode");
      gameStore.toggleDeterministicMode();
    };

    const toggleGame = () => {
      console.log(gameStore.isPaused ? "Resuming game" : "Pausing game");
      gameStore.isPaused ? gameStore.startGame() : gameStore.stopGame();
    };

    onUnmounted(() => {
      gameStore.stopGame();
    });

    const respond = (stimulusType) => {
      console.log(`Responding to stimulus type: ${stimulusType}`);
      gameStore.respondToStimulus(stimulusType);
    };

    const buttonClass = (isDisabled) => {
      return `p-4 rounded text-lg ${
        isDisabled ? 'bg-gray-900' : 'bg-blue-800 hover:bg-blue-700'
      }`;
    };

    const previousScore = ref(gameStore.score);

    watch(() => gameStore.score, (newScore, oldScore) => {
      console.log(`Score changed from ${oldScore} to ${newScore}`);
      previousScore.value = oldScore;
    });

    const scoreClass = computed(() => {
      return gameStore.score > previousScore.value
        ? 'text-green-500'
        : gameStore.score < previousScore.value
        ? 'text-red-500'
        : 'text-xl font-medium';
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
      { type: 'color', label: 'Color' },
      { type: 'emoji', label: 'Emoji' },
      { type: 'position', label: 'Position' },
      { type: 'shape', label: 'Shape' },
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
      showInstructionMessage,
      dismissInstructionMessage,
    };
  },
};
</script>
