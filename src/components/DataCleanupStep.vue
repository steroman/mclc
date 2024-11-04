<script setup lang="ts">
import { ref, computed } from 'vue';
import StepNavigation from './StepNavigation.vue';
import HelperText from './ui/HelperText.vue';
import Toggle from './ui/Toggle.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();

const handleNext = () => {
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};

const updateConfig = () => {
  store.processDataset(store.rawDataset);
};

const isCapitalsDisabled = computed(() => store.useGenericDataset);
const showHelperText = computed(() => store.useGenericDataset);
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Configure Data Cleanup</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-4">
        <h3 class="text-lg font-semibold mb-4">Cleanup Options</h3>
        <div class="space-y-6">
          <div>
            <Toggle
              v-model="store.datasetConfig.ignoreCapitals"
              :disabled="isCapitalsDisabled"
              label="Ignore capital letters"
              @update:modelValue="updateConfig"
            />
            <HelperText 
              v-if="showHelperText"
              text="Unavailable when a generic dataset is selected" 
            />
          </div>
          <div>
            <Toggle
              v-model="store.datasetConfig.ignoreNumbers"
              label="Ignore numbers"
              @update:modelValue="updateConfig"
            />
          </div>
          <div>
            <Toggle
              v-model="store.datasetConfig.ignoreSymbols"
              label="Ignore symbols and punctuation"
              @update:modelValue="updateConfig"
            />
          </div>
          <div>
            <Toggle
              v-model="store.datasetConfig.ignoreSpaces"
              label="Ignore spaces"
              @update:modelValue="updateConfig"
            />
          </div>
        </div>
      </div>

      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>