<script setup lang="ts">
import { ref, computed } from 'vue';
import StepNavigation from './StepNavigation.vue';
import Toggle from './ui/Toggle.vue';
import { useCalculatorStore } from '../stores/calculator';
import { languages } from '../data/languages';

const store = useCalculatorStore();
const selectedLanguageCode = ref('');
const currentFile = ref<File | null>(null);
const error = ref('');

// Placeholder expansion rates
const genericRates = [
  { label: 'Minimal (10%)', value: 1.1 },
  { label: 'Moderate (20%)', value: 1.2 },
  { label: 'Significant (30%)', value: 1.3 },
  { label: 'Large (40%)', value: 1.4 },
  { label: 'Very Large (50%)', value: 1.5 },
];

const availableLanguages = computed(() => {
  return languages.filter(lang => 
    lang.code !== store.selectedLanguageCode && 
    !store.localization.languages.some(l => l.code === lang.code)
  );
});

const handleNext = () => {
  if (!store.localization.enabled || 
      (store.localization.useGenericRates && store.localization.genericExpansionRate > 0) ||
      (!store.localization.useGenericRates && store.localization.languages.length > 0)) {
    store.nextStep();
  } else {
    error.value = 'Please complete the localization configuration before proceeding.';
  }
};

const handlePrevious = () => {
  store.previousStep();
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0] && selectedLanguageCode.value) {
    currentFile.value = input.files[0];
    error.value = '';
    
    try {
      const text = await currentFile.value.text();
      const dataset = JSON.parse(text);
      
      const language: LanguageData = {
        code: selectedLanguageCode.value,
        name: languages.find(l => l.code === selectedLanguageCode.value)?.name || '',
        dataset,
        averageLength: 0,
        expansionRate: 0,
        characterData: [],
      };
      
      store.processDataset(dataset, language);
      store.addLocalizationLanguage(language);
      
      // Reset selection
      selectedLanguageCode.value = '';
      currentFile.value = null;
      if (input.value) input.value = '';
    } catch (e) {
      error.value = 'Invalid JSON file. Please check the file format.';
    }
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Localization Settings</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-6">
        <!-- Enable/Disable Localization -->
        <div>
          <Toggle
            v-model="store.localization.enabled"
            label="Account for text expansion in other languages"
          />
        </div>

        <template v-if="store.localization.enabled">
          <!-- Generic vs Custom Rates -->
          <div class="space-y-4">
            <div>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="store.localization.useGenericRates"
                  :value="true"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm">Use generic expansion rates</span>
              </label>
            </div>
            <div>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="store.localization.useGenericRates"
                  :value="false"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm">Use custom language datasets</span>
              </label>
            </div>
          </div>

          <!-- Generic Rates Selection -->
          <div v-if="store.localization.useGenericRates" class="space-y-4">
            <h3 class="text-lg font-semibold">Select Expansion Rate</h3>
            <div class="space-y-2">
              <div v-for="rate in genericRates" :key="rate.value" class="flex items-center">
                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    v-model="store.localization.genericExpansionRate"
                    :value="rate.value"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm">{{ rate.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Custom Language Dataset Upload -->
          <div v-else class="space-y-4">
            <h3 class="text-lg font-semibold">Add Language Datasets</h3>
            
            <!-- Added Languages -->
            <div v-if="store.localization.languages.length > 0" class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Added Languages:</h4>
              <div class="space-y-2">
                <div 
                  v-for="lang in store.localization.languages" 
                  :key="lang.code"
                  class="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>{{ lang.name }}</span>
                  <button
                    @click="store.removeLocalizationLanguage(lang.code)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Add New Language -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Language
                </label>
                <select
                  v-model="selectedLanguageCode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a language</option>
                  <option
                    v-for="lang in availableLanguages"
                    :key="lang.code"
                    :value="lang.code"
                  >
                    {{ lang.name }}
                  </option>
                </select>
              </div>

              <div v-if="selectedLanguageCode">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Upload JSON Dataset
                </label>
                <input
                  type="file"
                  accept=".json"
                  @change="handleFileChange"
                  class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </template>

        <div v-if="error" class="p-4 bg-red-50 rounded-lg">
          <p class="text-red-800">{{ error }}</p>
        </div>
      </div>

      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>