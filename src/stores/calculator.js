import { defineStore } from 'pinia';

const calculateAverageLength = (dataset) => {
  const lengths = Object.values(dataset).map(str => str.length);
  return lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
};

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    currentStep: 1,
    elementWidth: 0,
    useGenericDataset: false,
    rawDataset: {},
    datasetConfig: {
      ignoreCapitals: false,
      ignoreNumbers: false,
      ignoreSymbols: false,
      ignoreSpaces: false,
    },
    characterData: [],
    mainLanguage: null,
    selectedLanguageCode: '',
    localization: {
      enabled: false,
      useGenericRates: true,
      genericExpansionRate: 1.3,
      languages: [],
    },
    maxCharLength: 0,
    adjustedMaxCharLength: null,
  }),

  actions: {
    nextStep() {
      this.currentStep++;
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    setElementWidth(width) {
      this.elementWidth = width;
    },
    setDatasetConfig(config) {
      this.datasetConfig = { ...this.datasetConfig, ...config };
    },
    setSelectedLanguage(code) {
      this.selectedLanguageCode = code;
    },
    setLocalizationEnabled(enabled) {
      this.localization.enabled = enabled;
    },
    setUseGenericRates(useGeneric) {
      this.localization.useGenericRates = useGeneric;
    },
    setGenericExpansionRate(rate) {
      this.localization.genericExpansionRate = rate;
    },
    addLocalizationLanguage(language) {
      this.localization.languages.push(language);
    },
    removeLocalizationLanguage(code) {
      const index = this.localization.languages.findIndex(lang => lang.code === code);
      if (index !== -1) {
        this.localization.languages.splice(index, 1);
      }
    },
    processDataset(dataset, forLanguage) {
      const values = Object.values(dataset);
      const combinedText = values.join(' ');
      
      const charCount = new Map();
      
      for (const char of combinedText) {
        const processedChar = this.datasetConfig.ignoreCapitals ? char.toLowerCase() : char;
        
        if (
          (this.datasetConfig.ignoreNumbers && /\d/.test(processedChar)) ||
          (this.datasetConfig.ignoreSymbols && /[^\w\s]/.test(processedChar)) ||
          (this.datasetConfig.ignoreSpaces && /\s/.test(processedChar))
        ) {
          continue;
        }
        
        charCount.set(processedChar, (charCount.get(processedChar) || 0) + 1);
      }
      
      const totalChars = Array.from(charCount.values()).reduce((a, b) => a + b, 0);
      
      const characterData = Array.from(charCount.entries()).map(([char, count]) => ({
        char,
        count,
        frequency: (count / totalChars) * 100,
        width: undefined,
      }));

      if (forLanguage) {
        forLanguage.characterData = characterData;
        forLanguage.averageLength = calculateAverageLength(dataset);
        
        const mainAvgLength = calculateAverageLength(this.rawDataset);
        forLanguage.expansionRate = forLanguage.averageLength / mainAvgLength;
      } else {
        this.rawDataset = dataset;
        this.characterData = characterData;
      }

      this.sortCharacterData(characterData, 'char', 'asc');
    },
    sortCharacterData(data, field, direction) {
      const compareFunction = (a, b) => {
        let result = 0;
        
        if (field === 'char') {
          const aIsSymbol = /[^\w\s]/.test(a.char);
          const bIsSymbol = /[^\w\s]/.test(b.char);
          const aIsNumber = /\d/.test(a.char);
          const bIsNumber = /\d/.test(b.char);
          
          if (aIsSymbol !== bIsSymbol) {
            return aIsSymbol ? 1 : -1;
          }
          if (aIsNumber !== bIsNumber) {
            return aIsNumber ? 1 : -1;
          }
          result = a.char.localeCompare(b.char, undefined, { sensitivity: 'base' });
        } else if (field === 'count' || field === 'frequency') {
          result = a[field] - b[field];
        }
        
        return direction === 'asc' ? result : -result;
      };
      
      data.sort(compareFunction);
    },
    calculateResults() {
      if (!this.elementWidth || this.characterData.length === 0) {
        return;
      }

      const allWidthsDefined = this.characterData.every(char => char.width !== undefined);
      if (!allWidthsDefined) {
        return;
      }

      const totalFrequencyWidth = this.characterData.reduce((sum, char) => {
        return sum + (char.frequency / 100) * (char.width || 0);
      }, 0);

      this.maxCharLength = Math.floor(this.elementWidth / totalFrequencyWidth);

      if (this.localization.enabled) {
        let expansionRate;

        if (this.localization.useGenericRates) {
          expansionRate = this.localization.genericExpansionRate;
        } else {
          expansionRate = Math.max(
            ...this.localization.languages.map(lang => lang.expansionRate),
            1
          );
        }

        this.adjustedMaxCharLength = Math.floor(this.maxCharLength / expansionRate);
      } else {
        this.adjustedMaxCharLength = null;
      }
    },
  },
});