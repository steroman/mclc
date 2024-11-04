<script setup lang="ts">
import { computed } from 'vue';
import StepNavigation from './StepNavigation.vue';
import { useCalculatorStore } from '../stores/calculator';
import { languages } from '../data/languages';

const store = useCalculatorStore();

const allWidthsEntered = computed(() => {
  return store.characterData.every(char => char.width !== undefined && char.width > 0);
});

// Calculate results when component is mounted
store.calculateResults();

const handlePrevious = () => {
  store.previousStep();
};

const getLanguageWithHighestExpansion = computed(() => {
  if (!store.localization.enabled || store.localization.useGenericRates) {
    return null;
  }
  return store.localization.languages.reduce((highest, current) => {
    return !highest || current.expansionRate > highest.expansionRate ? current : highest;
  }, null as LanguageData | null);
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Final Results</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div v-if="!allWidthsEntered" class="mb-6 p-4 bg-yellow-50 rounded-lg">
        <p class="text-yellow-800">
          Please ensure all character widths are entered before viewing results.
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Main Results -->
        <div class="p-4 bg-blue-50 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">Maximum Character Length</h3>
          <div class="space-y-2">
            <p class="text-blue-800" v-if="store.adjustedMaxCharLength !== null">
              Adjusted for localization: <span class="font-bold">{{ store.adjustedMaxCharLength }}</span> characters
            </p>
            <p class="text-blue-800">
              Without adjustment: <span class="font-bold">{{ store.maxCharLength }}</span> characters
            </p>
          </div>
        </div>

        <!-- Main Language Info -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Main Language Information</h3>
          <ul class="list-disc ml-6 text-gray-700">
            <li>Element width: {{ store.elementWidth }} pixels</li>
            <li>Language: {{ languages.find(l => l.code === store.selectedLanguageCode)?.name }}</li>
            <li>Total unique characters: {{ store.characterData.length }}</li>
            <li>Average character width: {{ (store.characterData.reduce((sum, char) => sum + (char.width || 0), 0) / store.characterData.length).toFixed(2) }} pixels</li>
          </ul>
        </div>

        <!-- Localization Info -->
        <div v-if="store.localization.enabled" class="p-4 bg-green-50 rounded-lg">
          <h3 class="text-lg font-semibold text-green-900 mb-2">Localization Information</h3>
          <div class="space-y-2">
            <template v-if="store.localization.useGenericRates">
              <p class="text-green-800">
                Using generic expansion rate: {{ ((store.localization.genericExpansionRate - 1) * 100).toFixed(0) }}%
              </p>
            </template>
            <template v-else>
              <div v-for="lang in store.localization.languages" :key="lang.code" class="text-green-800">
                <p class="font-medium">{{ lang.name }}:</p>
                <ul class="list-disc ml-6">
                  <li>Average length: {{ lang.averageLength.toFixed(2) }}</li>
                  <li>Expansion rate: {{ ((lang.expansionRate - 1) * 100).toFixed(2) }}%</li>
                </ul>
              </div>
              <p v-if="getLanguageWithHighestExpansion" class="mt-2 font-medium text-green-900">
                Highest expansion: {{ getLanguageWithHighestExpansion.name }} 
                ({{ ((getLanguageWithHighestExpansion.expansionRate - 1) * 100).toFixed(2) }}%)
              </p>
            </template>
          </div>
        </div>

        <!-- Character Summary -->
        <div class="overflow-auto">
          <h3 class="text-lg font-semibold mb-4">Character Summary</h3>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Character</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency (%)</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Width (px)</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="char in store.characterData" :key="char.char">
                <td class="px-4 py-2 text-sm">{{ char.char === ' ' ? '(space)' : char.char }}</td>
                <td class="px-4 py-2 text-sm">{{ char.count }}</td>
                <td class="px-4 py-2 text-sm">{{ char.frequency.toFixed(2) }}%</td>
                <td class="px-4 py-2 text-sm">{{ char.width }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-start mt-8">
        <button
          @click="handlePrevious"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Previous
        </button>
      </div>
    </div>
  </div>
</template>