<template>
  <div class="flex justify-around items-center my-4">
    <div>
      <label for="nBack" class="block text-sm font-medium text-gray-500">N-Back</label>
      <input type="number" id="nBack" :value="nBack" @input="$emit('update:nBack', $event.target.value)" min="1" class="text-black mt-1 p-2 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
    </div>
    <div>
      <label for="timeLeft" class="block text-sm font-medium text-gray-500">Timer (sec)</label>
      <input type="number" id="timeLeft" :value="timeLeft" @input="$emit('update:timeLeft', $event.target.value)" min="1" class="text-black mt-1 p-2 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
    </div>
  </div>
  <button @click="$emit('startGame')" class="mt-3 p-4 text-lg bg-blue-900 text-white font-medium rounded-md w-full shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300">
    Start Game
  </button>
</template>

<script>
export default {
  name: 'ConfigStart',
  props: {
    nBack: {
      type: Number,
      required: true
    },
    timeLeft: {
      type: Number,
      required: true
    }
  },
  emits: ['update:nBack', 'update:timeLeft', 'startGame'],
}
</script>
