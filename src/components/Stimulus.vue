<template>
  <div :class="[positionClass, colorClass, shapeClass]"></div>
</template>

<script>
export default {
  name: "Stimulus",
  props: {
    position: String,
    color: String,
    shape: String
  },
  computed: {
    positionClass() {
      return this.position === 'left' ? 'float-left ml-4' : 'float-right mr-4';
    },
    colorClass() {
      return this.color === 'purple' ? 'bg-purple-500' : 'bg-green-500';
    },
    shapeClass() {
      return this.shape === 'circle' ? 'w-24 h-24 rounded-full' : 'w-24 h-24 rounded-none';
    },
  },
};
</script>
