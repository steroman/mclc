# Max character length calculator for UI elements

This app calculates the maximum allowed character length for UI elements based on real data, as expressed in my article [A formula for defining maximum character lengths](https://uxcontent.com/a-formula-for-defining-maximum-character-lengths/).

The formula is: `MAX LENGTH = BUTTON WIDTH / AVERAGE CHARACTER WIDTH`

The average character width is calculated by taking the average of the widths of all characters in the dataset, weighted by their frequency.

To complete the calculation, users need to input:

- The dataset as a JSON file (Check [src/assets/sample-files/en-us.json](src/assets/sample-files/en-us.json) for an example of the expected format)
    - Alternatively, they can use a generic dataset (but only English will work as a source language)
- The width of the UI element in pixels (after subtracting any margins and paddings)
- The width of each character in pixels
- (Optional) Additional JSON files for localization languages to adjust the maximum character length by the expansion rate of the language with the highest expansion 

When using their own dataset, users will be able to:

- Ignore capital letters (such as `A` and `a`—they'll be counted as the same character)
- Ignore numbers (such as `1` and `2`—they'll be removed from the dataset)
- Ignore symbols (such as `!` and `?`—they'll be removed from the dataset)
- Ignore spaces (they'll be removed from the dataset)

## Usage

### Install

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```