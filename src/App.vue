<script setup>

import { useCalculatorStore } from './stores/calculator.js';
import WelcomeStep from './components/WelcomeStep.vue';
import WidthInputStep from './components/WidthInputStep.vue';
import DatasetSelectionStep from './components/DatasetSelectionStep.vue';
import DataCleanupStep from './components/DataCleanupStep.vue';
import CharacterWidthStep from './components/CharacterWidthStep.vue';
import LocalizationStep from './components/LocalizationStep.vue';
import ResultsStep from './components/ResultsStep.vue';

const store = useCalculatorStore();

const getCurrentStep = () => {
  switch (store.currentStep) {
    case 1:
      return WelcomeStep;
    case 2:
      return WidthInputStep;
    case 3:
      return DatasetSelectionStep;
    case 4:
      return DataCleanupStep;
    case 5:
      return CharacterWidthStep;
    case 6:
      return LocalizationStep;
    case 7:
      return ResultsStep;
    default:
      return WelcomeStep;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <component :is="getCurrentStep()" />
  </div>
</template>