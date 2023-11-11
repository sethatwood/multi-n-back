<template>
  <div class="container mx-auto px-4 py-5">
    <h1 class="text-xl font-bold text-center mb-5">Poly N-Back Game</h1>
    <Stimulus position="left" color="purple" shape="circle" />
    <!-- Additional game components will go here -->
  </div>
</template>

<script>
import Stimulus from './components/Stimulus.vue';

export default {
  name: 'App',
  components: {
    Stimulus,
  },
  // Any component-specific logic goes here
};
</script>
