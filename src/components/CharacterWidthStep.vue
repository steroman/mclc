<script setup lang="ts">
import { ref, computed } from 'vue';
import StepNavigation from './StepNavigation.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();
const sortField = ref<SortField>('char');
const sortDirection = ref<SortDirection>('asc');

const characterSummary = computed(() => {
  return store.characterData.map(char => ({
    ...char,
    frequency: char.frequency.toFixed(2),
  }));
});

const handleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  store.sortCharacterData(store.characterData, field, sortDirection.value);
};

const getSortIcon = (field: SortField) => {
  if (sortField.value !== field) return '↕️';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};

const handleNext = () => {
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};

const updateCharacterWidth = (char: string, width: string) => {
  const numWidth = parseFloat(width);
  if (!isNaN(numWidth)) {
    const charData = store.characterData.find(c => c.char === char);
    if (charData) {
      charData.width = numWidth;
    }
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Character Widths</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-6">
        <!-- Character Summary with Width Inputs -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Enter Character Widths</h3>
          <div class="overflow-auto max-h-80">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    @click="handleSort('char')"
                  >
                    Character {{ getSortIcon('char') }}
                  </th>
                  <th 
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    @click="handleSort('count')"
                  >
                    Count {{ getSortIcon('count') }}
                  </th>
                  <th 
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    @click="handleSort('frequency')"
                  >
                    Frequency (%) {{ getSortIcon('frequency') }}
                  </th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Width (pixels)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="char in characterSummary" :key="char.char">
                  <td class="px-4 py-2 text-sm">{{ char.char === ' ' ? '(space)' : char.char }}</td>
                  <td class="px-4 py-2 text-sm">{{ char.count }}</td>
                  <td class="px-4 py-2 text-sm">{{ char.frequency }}%</td>
                  <td class="px-4 py-2 text-sm">
                    <input
                      type="number"
                      step="0.1"
                      :value="char.width"
                      @input="(e) => updateCharacterWidth(char.char, (e.target as HTMLInputElement).value)"
                      class="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
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