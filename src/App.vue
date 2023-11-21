<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto" id="howToPlayModal">
    <div class="relative mx-auto p-5 border container shadow-lg rounded-md bg-slate-200">
      <IntroContent :n-back="gameStore.nBack" />
      <div v-if="showModal">
        <ConfigStart
          :nBack="Number(nBackInput)"
          :timeLeft="Number(timeLeftInput)"
          @update:nBack="nBackInput = $event"
          @update:timeLeft="timeLeftInput = $event"
          @startGame="startGame"
        />
      </div>
      <Footer />
    </div>
  </div>
  <div v-else class="max-w-md mx-auto px-4 text-center uppercase text-white bg-slate-900">
    <div v-if="showInstructionMessage" class="my-6 text-center text-gray-400 text-sm cursor-pointer" @click="dismissInstructionMessage">
      &#x24E7; Match attributes from {{ gameStore.nBack }} steps back
    </div>
    <div class="mt-8 mb-3">
      <p class="countdown-text">{{ gameStore.timeLeft }}</p>
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
        :disabled="gameStore.respondedThisTurn[button.type] || gameStore.isEarlyInGame"
        :class="buttonClass(gameStore.respondedThisTurn[button.type], gameStore.isEarlyInGame)"
        @click="respond(button.type)">
        {{ button.label }}
      </button>
    </div>
    <div class="text-center">
      <div class="mt-4 text-sm uppercase text-red-500 flex items-center justify-center">
        <span class="text-2xl font-bold">{{ gameStore.incorrectResponses }}</span>&nbsp;Strikes
      </div>
      <div class="text-sm uppercase text-green-500 flex items-center justify-center">
        <span class="text-2xl font-bold">{{ gameStore.score }}</span>&nbsp;Points
      </div>
      <p class="mt-2 text-sm uppercase text-gray-500">
        High Score: {{ gameStore.highScoreData.score }}/{{ gameStore.highScoreData.potentialCorrectAnswers }}
        ({{ gameStore.highScoreAccuracy }}%)
      </p>
    </div>
    <div v-if="gameStore.isPaused || gameStore.incorrectResponses >= 3">
      <ConfigStart
        :nBack="Number(nBackInput)"
        :timeLeft="Number(timeLeftInput)"
        @update:nBack="nBackInput = $event"
        @update:timeLeft="timeLeftInput = $event"
        @startGame="startGame"
      />
    </div>
    <button @click="toggleGame" class="mx-1 mt-3 bg-gray-800 hover:bg-gray-950 text-gray-400 py-1 px-2 rounded">
      {{ gameStore.isPaused ? 'Start' : 'End' }} Game
    </button>
    <button
      @click="toggleDeterministicMode"
      class="mx-1 my-1 bg-gray-800 hover:bg-gray-950 text-gray-400 py-1 px-2 rounded"
    >
      {{ gameStore.isDeterministic ? 'Disable' : 'Enable' }} Deterministic
    </button>
    <div class="mt-2">
      <button class="text-xs text-gray-400 bg-gray-800  hover:bg-gray-950 p-3 rounded-full focus:outline-none" @click="toggleAudio">
        <i v-if="gameStore.isAudioEnabled" class="fas fa-volume-up"></i>
        <i v-else class="fas fa-volume-mute"></i>
      </button>
    </div>
    <div
      v-if="gameStore.isDeterministic"
      class="mt-4 text-center text-sm"
    >
      <div v-for="stimulus, index in gameStore.deterministicStimuli" :key="index" class="mt-1">
          {{ gameStore.deterministicIndex - 1 === index ? '->' : '' }}
          <span :class="colorClass(stimulus.color)">{{ stimulus.color }}</span>
          •
          {{ stimulus.emoji }}
          •
          {{ stimulus.position }}
          •
          {{ stimulus.shape }}
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
import ConfigStart from './ConfigStart.vue';
import Stimulus from './Stimulus.vue';
import Footer from './Footer.vue';

export default {
  name: 'App',
  components: {
    IntroContent,
    ConfigStart,
    Stimulus,
    Footer,
  },
  setup() {
    const gameStore = useGameStore();
    const nBackInput = ref(gameStore.nBack);
    const timeLeftInput = ref(gameStore.timeLeft);
    const showModal = ref(true);
    const showInstructionMessage = ref(true);

    const dismissInstructionMessage = () => {
      console.log("Instruction message dismissed");
      showInstructionMessage.value = false;
    }

    const startGame = () => {
      console.log("Start game button clicked");

      // Update gameStore values before starting the game
      gameStore.nBack = nBackInput.value;
      gameStore.timeLeft = timeLeftInput.value;

      showModal.value = false;
      gameStore.startGame(timeLeftInput.value);
    };

    const toggleDeterministicMode = () => {
      console.log("Toggle deterministic mode");
      gameStore.toggleDeterministicMode();
    };

    const toggleGame = () => {
      console.log(gameStore.isPaused ? "Resuming game" : "Pausing game");
      gameStore.isPaused ? gameStore.startGame(timeLeftInput.value) : gameStore.stopGame();
    };

    onUnmounted(() => {
      gameStore.stopGame();
    });

    const respond = (stimulusType) => {
      console.log(`Responding to stimulus type: ${stimulusType}`);
      gameStore.respondToStimulus(stimulusType);
    };

    const buttonClass = (isResponded, isEarlyInGame) => {
      if (isResponded || isEarlyInGame) {
        return 'p-4 rounded text-lg bg-gray-950';
      } else {
        return 'p-4 rounded text-lg bg-blue-900 hover:bg-blue-800';
      }
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

    const toggleAudio = () => {
      gameStore.toggleAudio();
    };

    return {
      buttonClass,
      colorClass,
      dismissInstructionMessage,
      gameStore,
      nBackInput,
      respond,
      responseButtons,
      scoreClass,
      showInstructionMessage,
      showModal,
      startGame,
      timeLeftInput,
      toggleAudio,
      toggleDeterministicMode,
      toggleGame,
    };
  },
};
</script>

<style scoped>
.countdown-text {
  font-size: 3.33rem;
  font-weight: bold;
}
</style>