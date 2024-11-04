<script setup lang="ts">
import StepNavigation from './StepNavigation.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();

const handleNext = () => {
  store.nextStep();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Max character length calculator for UI elements</h1>
    <div class="bg-white rounded-lg shadow-md p-6">
      <p class="mb-4">Welcome,</p>
      <p class="mb-4">
        This tool will help you calculate the maximum character length for your UI elements.
        You'll need:
      </p>
      <ul class="list-disc ml-6 mb-6">
        <li>The width of your UI element in pixels</li>
        <li>A dataset of text content (or use our generic dataset)</li>
        <li>Character width measurements for your font</li>
      </ul>
      <p class="mb-4">
        The calculator will guide you through the process step by step.
      </p>
      <StepNavigation @next="handleNext" />
    </div>
  </div>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold mb-4">Disclaimer</h2>
      <p class="mb-4">
        A few things to know before using this tool:
</p>
      <ul class="list-disc ml-6 mb-6">
          <li> I'm not storing any of your data—Everything runs in the browser and is reset every time you refresh the page</li>
          <li> This is a passion project and it's far from perfect. If you spot any issues or have any suggestions, you can report them <a class="text-blue-500" href="https://github.com/steroman/max-char-length-calculator/issues/new/choose">directly on GitHub</a></li>
          <li> The project is also open-source. You can find the code on <a class="text-blue-500" href="https://github.com/steroman/max-char-length-calculator">GitHub</a></li>
          <li> Code produced by AI (ChatGPT + Bolt)</li>
        </ul>
      <p class="mb-4">Based on my article <a class="text-blue-500" href="https://uxcontent.com/a-formula-for-defining-maximum-character-lengths/">A formula for defining maximum character lengths</a>.</p>
</div>
    </div>
</template>