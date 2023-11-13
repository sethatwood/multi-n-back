<template>
  <div class="flex justify-center space-x-2">
    <!-- Left Cell -->
    <div :class="[cellClass, 'w-28 h-28 bg-slate-900 rounded-md flex items-center justify-center']">
      <template v-if="position === 'left'">
        <div v-if="shape !== 'triangle'" :class="[colorClass, shapeClass]"></div>
        <span v-else :class="colorClass" class="triangle">&#9650;</span>
      </template>
    </div>
    <!-- Center Cell -->
    <div :class="[cellClass, 'w-28 h-28 bg-slate-900 rounded-md flex items-center justify-center']">
      <template v-if="position === 'center'">
        <div v-if="shape !== 'triangle'" :class="[colorClass, shapeClass]"></div>
        <span v-else :class="colorClass" class="triangle">&#9650;</span>
      </template>
    </div>
    <!-- Right Cell -->
    <div :class="[cellClass, 'w-28 h-28 bg-slate-900 rounded-md flex items-center justify-center']">
      <template v-if="position === 'right'">
        <div v-if="shape !== 'triangle'" :class="[colorClass, shapeClass]"></div>
        <span v-else :class="colorClass" class="triangle">&#9650;</span>
      </template>
    </div>
  </div>
</template>

<script>
import { useGameStore } from './store/gameStore';

export default {
  name: "Stimulus",
  props: {
    position: String,
    color: String,
    shape: String
  },
  setup() {
    const gameStore = useGameStore();

    return {
      gameStore
    };
  },
  computed: {
    colorClass() {
      switch (this.color) {
        case 'purple': return 'text-purple-500';
        case 'green': return 'text-green-500';
        case 'blue': return 'text-blue-500';
        default: return '';
      }
    },
    shapeClass() {
      switch (this.shape) {
        case 'circle': return 'w-20 h-20 rounded-full bg-current';
        case 'square': return 'w-20 h-20 bg-current';
        default: return '';
      }
    },
    cellClass() {
      return this.gameStore.flashBorder ? 'border border-slate-500' : '';
    },
  },
};
</script>

<style>
.triangle {
  font-size: 7rem;
  line-height: 1;
}
</style>
