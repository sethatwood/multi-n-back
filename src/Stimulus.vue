<template>
  <div class="flex justify-center space-x-2">
    <div :class="[cellClass, 'w-40 h-40 bg-slate-900 rounded-md flex items-center justify-center']">
      <div v-if="position === 'left'" :class="[colorClass, shapeClass]"></div>
    </div>
    <div :class="[cellClass, 'w-40 h-40 bg-slate-900 rounded-md flex items-center justify-center']">
      <div v-if="position === 'right'" :class="[colorClass, shapeClass]"></div>
    </div>
  </div>
</template>

<script>
import { useGameStore } from './store/gameStore'; // Adjust the path as needed

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
      return this.color === 'purple' ? 'bg-purple-500' : 'bg-green-500';
    },
    shapeClass() {
      return this.shape === 'circle' ? 'w-32 h-32 rounded-full' : 'w-32 h-32';
    },
    cellClass() {
      return this.gameStore.flashBorder ? 'border border-slate-500' : '';
    },
  },
};
</script>
