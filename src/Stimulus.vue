<template>
  <div class="flex justify-center space-x-2">
    <div class="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
        <div
          v-if="position === 'left'"
          :class="[colorClass, shapeClass]">
        </div>
    </div>
    <div class="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
      <div
        v-if="position === 'right'"
        :class="[colorClass, shapeClass]">
      </div>
    </div>
  </div>
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
    colorClass() {
      return this.color === 'purple' ? 'bg-purple-500' : 'bg-green-500';
    },
    shapeClass() {
      return this.shape === 'circle' ? 'w-16 h-16 rounded-full' : 'w-16 h-16';
    },
  },
};
</script>
