<script setup lang="ts">
import { ref, watch } from 'vue';
import StepNavigation from './StepNavigation.vue';
import HelperText from './ui/HelperText.vue';
import { useCalculatorStore } from '../stores/calculator';
import { languages } from '../data/languages';
import { genericDataset } from '../data/genericDataset';

const store = useCalculatorStore();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const error = ref<string>('');

// Watch for changes in useGenericDataset
watch(() => store.useGenericDataset, (newValue) => {
  if (newValue) {
    // Set language to English (en) when generic dataset is selected
    store.selectedLanguageCode = 'en';
    // Process the generic dataset
    const dataset = Object.entries(genericDataset.frequencies).reduce((acc, [char, freq]) => {
      // Create a string that represents the frequency
      const count = Math.round(freq * 1000); // Multiply by 1000 to get a reasonable sample size
      acc[char] = char.repeat(count);
      return acc;
    }, {} as Record<string, string>);
    store.processDataset(dataset);
  } else {
    store.selectedLanguageCode = '';
  }
});

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    error.value = '';
  }
};

const handleNext = async () => {
  if (!store.useGenericDataset && !selectedFile.value) {
    error.value = 'Please upload a JSON file or select to use the generic dataset';
    return;
  }

  if (!store.selectedLanguageCode) {
    error.value = 'Please select a language';
    return;
  }

  if (selectedFile.value) {
    try {
      const text = await selectedFile.value.text();
      const dataset = JSON.parse(text);
      store.processDataset(dataset);
    } catch (e) {
      error.value = 'Invalid JSON file. Please check the file format.';
      return;
    }
  }

  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Select Dataset</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <input
              id="generic-dataset"
              type="radio"
              v-model="store.useGenericDataset"
              :value="true"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label for="generic-dataset" class="text-sm font-medium text-gray-700">
              Use generic dataset (English only)
            </label>
          </div>
          <HelperText 
            text="Based on standard English letter frequency data from [Link]"
            :link="{
              url: 'https://en.wikipedia.org/wiki/Letter_frequency',
              text: 'Wikipedia'
            }"
          />
          <div class="flex items-center space-x-3">
            <input
              id="custom-dataset"
              type="radio"
              v-model="store.useGenericDataset"
              :value="false"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label for="custom-dataset" class="text-sm font-medium text-gray-700">
              Upload custom dataset
            </label>
          </div>
        </div>

        <div v-if="!store.useGenericDataset" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Upload JSON File
          </label>
          <input
            type="file"
            ref="fileInput"
            accept=".json"
            @change="handleFileChange"
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p v-if="selectedFile" class="mt-2 text-sm text-green-600">
            Selected file: {{ selectedFile.name }}
          </p>
          <p v-if="error" class="mt-2 text-sm text-red-600">
            {{ error }}
          </p>
        </div>

        <!-- Language Selection -->
        <div class="mt-6">
          <label for="language" class="block text-sm font-medium text-gray-700 mb-2">
            Select Language
          </label>
          <select
            id="language"
            v-model="store.selectedLanguageCode"
            :disabled="store.useGenericDataset"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a language</option>
            <option
              v-for="lang in languages"
              :key="lang.code"
              :value="lang.code"
            >
              {{ lang.name }}
            </option>
          </select>
        </div>
      </div>

      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>