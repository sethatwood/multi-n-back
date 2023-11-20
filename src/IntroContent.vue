<template>
  <div class="instructions mt-2 px-4">
    <img src="/logo.png" class="rounded-2xl mx-auto" style="width: 180px; height: 180px; object-fit: contain;"/>
    <h2 class=" text-center text-xl font-semibold mt-3">Welcome to Poly N-Back!</h2>
    <p class=" text-center text-md mt-2">
      Poly N-Back is a variation of the <a href="https://en.wikipedia.org/wiki/N-back" class="text-blue-500 hover:text-blue-700 underline" target="_blank">N-back</a> memory game designed to improve your cognitive skills.
    </p>
    <div class="border border-slate-300 mt-4" />
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
</template>

<script>
import { useGameStore } from './store/gameStore';

export default {
  name: "IntroContent",
  setup() {
    const gameStore = useGameStore();

    return {
      gameStore
    };
  }
}
</script>