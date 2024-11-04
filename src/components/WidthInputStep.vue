<script setup lang="ts">
import { ref } from 'vue';
import StepNavigation from './StepNavigation.vue';
import HelperText from './ui/HelperText.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();
const width = ref(store.elementWidth);

const handleNext = () => {
  if (width.value > 0) {
    store.setElementWidth(width.value);
    store.nextStep();
  }
};

const handlePrevious = () => {
  store.previousStep();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Enter UI Element Width</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <label for="width" class="block text-sm font-medium text-gray-700 mb-2">
          Width in pixels
        </label>
        <input
          id="width"
          type="number"
          v-model="width"
          min="1"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter width in pixels"
        />
        <HelperText text="Remember to subtract any margins and paddings" />
      </div>
      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>