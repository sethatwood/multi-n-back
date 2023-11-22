<template>
  <div class="instructions mt-2 px-4">
    <p class="text-md mt-4 font-semibold">
      Here's how you can play:
    </p>
    <p class="text-md mt-2">
      • Click the buttons that match the attributes you saw <strong>{{ gameStore.nBack }}</strong> turns ago. (Color, Emoji, Position, Shape)
    </p>
    <p class="text-md mt-2">
      • Correct responses increase your score.
    </p>
    <p class="text-md mt-2">
      • The game ends if you accumulate 3 strikes.
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