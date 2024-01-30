/**
 * This is a copy of validate-color function from validate-color npm package. This package has problem with bundling, so I copied it here. It was modified 100 years ago anyway and had 32 stars, so nothing fancy really.
 */

// Good article on HTML Colors:
// https://dev.to/alvaromontoro/the-ultimate-guide-to-css-colors-2020-edition-1bh1#hsl

// Check if parameter is defined and a string
const isString = (color: string) => color && typeof color === "string";
// All existing HTML color names
const htmlColorNames = [
  "AliceBlue",
  "AntiqueWhite",
  "Aqua",
  "Aquamarine",
  "Azure",
  "Beige",
  "Bisque",
  "Black",
  "BlanchedAlmond",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Cornsilk",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenrod",
  "DarkGray",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DodgerBlue",
  "FireBrick",
  "FloralWhite",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "GhostWhite",
  "Gold",
  "Goldenrod",
  "Gray",
  "Green",
  "GreenYellow",
  "HoneyDew",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Ivory",
  "Khaki",
  "Lavender",
  "LavenderBlush",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGoldenrodYellow",
  "LightGray",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSteelBlue",
  "LightYellow",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquamarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenrod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "SeaShell",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "Snow",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "White",
  "WhiteSmoke",
  "Yellow",
  "YellowGreen",
];
// These 3 values are valid, usable color names, which are special in their own way
const htmlColorNamesSpecial = ["currentColor", "inherit", "transparent"];

// Validate HTML color name (red, yellow, etc)
export const validateHTMLColorName = (color: string): boolean => {
  let status = false;
  if (isString(color)) {
    htmlColorNames.map((c) => {
      if (color.toLowerCase() === c.toLowerCase()) {
        status = true;
      }
      return null;
    });
  }
  return status;
};

// Validate HTML color special name (currentColor, inherit, etc)
export const validateHTMLColorSpecialName = (color: string): boolean => {
  let status = false;
  if (isString(color)) {
    htmlColorNamesSpecial.map((c) => {
      if (color.toLowerCase() === c.toLowerCase()) {
        status = true;
      }
      return null;
    });
  }
  return status;
};

// Validate HTML color 'hex'
export const validateHTMLColorHex = (color: string): boolean => {
  if (isString(color)) {
    const regex = /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i;
    return !!color && regex.test(color);
  }
  return false;
};

// Validate HTML color 'rgb'
// -- legacy notation
// color: rgb(255, 255, 255);
// color: rgba(255, 255, 255, 1);
// -- new notation
// color: rgb(255 255 255);
// color: rgb(255 255 255 / 1);
// Note that 'rgba()' is now merged into 'rgb()'
export const validateHTMLColorRgb = (color: string): boolean => {
  if (isString(color)) {
    const regex =
      /(rgb)a?\((\s*\d+%?\s*?,?\s*){2}(\s*\d+%?\s*?,?\s*\)?)(\s*,?\s*\/?\s*(0?\.?\d+%?\s*)?|1|0)?\)$/i;
    return !!color && regex.test(color);
  }
  return false;
};

const optionalCommaOrRequiredSpace = `((\\s*,\\s*)|(\\s+))`;
const optionalDecimals = `(\\.\\d+)?`;
const anyPercentage = `((\\d*${optionalDecimals})%)`;
const hundredPercent = `(([0-9]|[1-9][0-9]|100)%)`;
const alphaPercentage = `(((${hundredPercent}))|(0?${optionalDecimals})|1))?`;
const endingWithAlphaPercentage = `\\s*?\\)?)(\\s*?(\\/?)\\s+${alphaPercentage}\\s*?\\)$`;

// Validate HTML color 'hsl'
// -- These units are valid for the first parameter
// 'deg': degrees | full circle = 360
// 'gra': gradians | full circle = 400
// 'radians': radians | full circle = 2π (approx. 6.28)
// 'turn': turns | full circle = 1
export const validateHTMLColorHsl = (color: string): boolean => {
  if (isString(color)) {
    // Validate each possible unit value separately, as their values differ
    const degRegex = `(-?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9]|360)(deg)?)`;
    const graRegex = `(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-9][0-9]|400)gra)`;
    const radRegex = `((([0-5])?\\.\\d+|6\\.([0-9]|1[0-9]|2[0-8])|[0-6])rad)`;
    const turnRegex = `((0?${optionalDecimals}|1)turn)`;
    const regexLogic = `(hsl)a?\\((\\s*?(${degRegex}|${graRegex}|${radRegex}|${turnRegex})${optionalCommaOrRequiredSpace})(\\s*?(0|${hundredPercent})${optionalCommaOrRequiredSpace})(\\s*?(0|${hundredPercent})\\s*?\\)?)(\\s*?(\\/?|,?)\\s*?(((${hundredPercent}))|(0?${optionalDecimals})|1))?\\)$`;
    const regex = new RegExp(regexLogic);
    return !!color && regex.test(color);
  }
  return false;
};

// Validate HTML color 'hwb'
// -- 'hwb' accepts 'deg' as unit in its 1st property, which stands for 'hue'
// 'deg': degrees | full circle = 360
export const validateHTMLColorHwb = (color: string): boolean => {
  if (isString(color)) {
    const degRegex = `(-?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9]|360)(deg)?)`;
    const regexLogic = `(hwb\\(\\s*?${degRegex}\\s+)((0|${hundredPercent})\\s+)((0|${hundredPercent})${endingWithAlphaPercentage}`;
    const regex = new RegExp(regexLogic);
    return !!color && regex.test(color);
  }
  return false;
};

// Validate HTML color 'lab'
// -- 'lab' 2nd & 3rd parameters are any number between -160 & 160
export const validateHTMLColorLab = (color: string): boolean => {
  if (isString(color)) {
    const labParam = `(-?(([0-9]|[1-9][0-9]|1[0-5][0-9])${optionalDecimals}?|160))`;
    const regexLogic = `(lab\\(\\s*?${anyPercentage}\\s+${labParam}\\s+${labParam}${endingWithAlphaPercentage}`;
    const regex = new RegExp(regexLogic);
    return !!color && regex.test(color);
  }

  return false;
};

// Validate only HTML colors (`hex`, `rgb`, `rgba`, `hsl`, `hsla`, `hwb`, `lab`), without `name` og `special name`**
export const validateHTMLColor = (color: string): boolean => {
  if (
    (color && validateHTMLColorHex(color)) ||
    validateHTMLColorRgb(color) ||
    validateHTMLColorHsl(color) ||
    validateHTMLColorHwb(color) ||
    validateHTMLColorLab(color)
  ) {
    return true;
  }
  return false;
};

const validateColor = (color: string) => {
  // Former validation - source: https://www.regextester.com/103656
  // if (isString(color)) {
  //   const regex = /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$|(rgb|hsl)a?\((\s*-?\d+%?\s*,){2}(\s*-?\d+%?\s*,?\s*\)?)(,\s*(0?\.\d+)?|1|0)?\)$/i;
  //   return color && regex.test(color);
  // }
  // New validation
  if (
    (color && validateHTMLColorHex(color)) ||
    validateHTMLColorName(color) ||
    validateHTMLColorSpecialName(color) ||
    validateHTMLColorRgb(color) ||
    validateHTMLColorHsl(color) ||
    validateHTMLColorHwb(color) ||
    validateHTMLColorLab(color)
  ) {
    return true;
  }
  return false;
};

export { validateColor };
