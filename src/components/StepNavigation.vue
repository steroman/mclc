<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'previous'): void;
}>();
</script>

<template>
  <div class="flex justify-between mt-8">
    <button
      v-if="store.currentStep > 1"
      @click="emit('previous')"
      class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
    >
      Previous
    </button>
    <div v-else class="w-20"></div>
    <button
      @click="emit('next')"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Next
    </button>
  </div>
</template>