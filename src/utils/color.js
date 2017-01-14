import {
  DEFAULT_ADJUSTERS,
} from 'constants';
import color from 'color';
import colorFn from 'css-color-function';
import tinycolor from 'tinycolor2';

/**
 * @param {String} hslStr - A valid hsl(a) color string.
 * @return {Object} An object containing the h,s,l values of the given hslStr.
 *                  Object keys include; hue, saturation, lightness.
 */
export const getHslObjFromStr = hslStr => {
  // First remove the 'hsl' or 'hsla' and the opening '('
  const arr = hslStr.replace(/hsla?\(/gi, '')
    // Remove any spaces
    .replace(/\s+/g, '')
    // Remove any percentage chars
    .replace(/%/g, '')
    // Create an array of the values
    .split(',')
    // Discard the forth value–the alpha–if it's there
    .slice(0, 3)
    // Ensure each value is an Int
    .map(v => parseInt(v, 10));

  return {
    h: arr[0],
    s: arr[1],
    l: arr[2]
  };
};

/**
 * @param {String} colorStr - A valid hex, rgb, rgba color.
 * @return {Object} An object containing the properties of the given colorStr.
 *                  properties include; rgb, hsl, hwb, alpha, lightness,
 *                  blackness, whiteness.
 */
export const getColorProperties = colorStr => {
  const tinyColorObj = tinycolor(colorStr);

  const {
    _a: alpha,
    _r: red,
    _g: green,
    _b: blue
  } = tinyColorObj;

  // NOTE: The `tinycolor` package sometimes changes input values for hsl(a)
  // strings. We should always trust the direct input. If this colorStr is an
  // hsl(a) color, use our internal method that only breaks the string into
  // the components and does not modify the values. If it's not an hsl color
  // we can trust tinycolor to do it's thing.
  let hue = 0;
  let saturation = 0;
  let lightness = 0;

  if (colorStr.includes('hsl')) {
    const {h, s, l} = getHslObjFromStr(colorStr);
    hue = h;
    saturation = s;
    lightness = l;
  } else {
    const {h, s, l} = tinyColorObj.toHsl();
    hue = h;
    saturation = s * 100;
    lightness = l * 100;
  }

  // NOTE: the `color` package cannot handle hex4 or hex8 values.
  // TODO: Figure out a way of getting the blackness and whiteness values
  // here instead of using other package.
  const colorObj = color(tinyColorObj.toRgbString());
  const {
    b: blackness,
    w: whiteness
  } = colorObj.hwb().object();

  const properties = {
    alpha: alpha * 100,
    hue,
    lightness,
    saturation,
    blackness,
    whiteness,
    red,
    green,
    blue
  };

  // Remove any floats on the way out.
  return Object.keys(properties).reduce((prev, curr) => {
    prev[curr] = parseInt(properties[curr], 10);
    return prev;
  }, {});
};

/**
 * @param {String} colorStr - A valid hex, rgb, rgba color.
 * @return {Array} An array of adjuster objects for the colorStr.
 */
export const getAdjustersForColor = (colorStr, baseAdjusters) => {
  const colorProperties = getColorProperties(colorStr);

  return baseAdjusters.map(a => {
    let adjuster = {...a};
    const prop = colorProperties[a.name];
    adjuster.enabled = false;

    if (prop !== undefined) {
      adjuster.value = prop;
    }

    return adjuster;
  });
};

/**
 * @param {Array} adjusters - An array of adjuster objects.
 * @param {Bool} useShortNames - Optional param to use short names for
 *                               adjusters when available. Default: false
 * @return {String} A string of space-seprated color adjusters.
 *                  ex; "alpha(100%) hue(250) saturation(50%)"
 */
export const getAdjustersString = (adjusters, useShortNames = false) => {
  return adjusters.reduce((prev, curr) => {
    const {
      name,
      value,
      shortName,
      unit = ''
    } = curr;

    const nameToUse = (shortName && useShortNames) ? shortName : name;

    if (curr.enabled) {
      return `${prev} ${nameToUse}(${value}${unit})`;
    }

    return prev;
  }, '');
};

/**
 * @param {String} baseColor - A valid color string
 * @param {String} adjustersStr - A valid color adjusters string
 * @return {String} A CSS color function string or an empty string if no adjusters.
 *                  ex; "color(#ff0004 alpha(100%) hue(250) saturation(50%))"
 */
export const getColorFuncString = (baseColor, adjustersStr = '') => {
  return `color(${baseColor}${adjustersStr})`;
};

/**
 * @param {String} val - A string that looks like a hex, rgb, or rgba color.
 * @return {String} A valid color as a string.
 */
export const getColorFromQueryVal = (val) => {
  const {
    hash,
    search
  } = window.location;

  let baseColor = val.toLowerCase();

  try {
    baseColor = decodeURIComponent(val.toLowerCase());
  } catch (e) {
    console.info(`getColorFromQueryVal saw a malformed URL in the
color string provided in URL: ${search}. Using the input as is.`
.replace(/\n/gm, ' '));
  }

  // Assume the user put an non-encoded "#" in the value for a hex color.
  // Browsers will see this as window.location.hash.
  if (baseColor.length === 0 && hash) {
    baseColor = hash;
  }

  const c = tinycolor(baseColor);

  if (c.isValid()) {
    // If the user enters a hex value without a '#' char, add it for them.
    if (c.getFormat().includes('hex') && !baseColor.includes('#')) {
      baseColor = `#${baseColor}`;
    }

    return baseColor;
  } else {
    console.info(`getColorFromQueryVal couldn't figure out how to parse the
color string provided in URL: ${search}. Returning null.`.replace(/\n/gm, ' '));
    return null;
  }
};

/**
 * getContrastColor - For the given baseColor, return a color with sufficient
 * contrast per WCAG Guidelines.
 *
 * @param {String} baseColor - A hex, hex3, hex4, hex8 rgb(a), hsl(a) or
 *                             keyword color.
 * @param {String} amt - optional - The contrast amount. Default: 100%.
 * @return {String} A color with sufficient contrast to the base color or black
 *                  if the baseColor has an alpha value. less than 50.
 */
export const getContrastColor = (baseColor, amt = '100%') => {
  const aThreshold = 50;
  const props = getColorProperties(baseColor);

  // This ensures we never use a color with an alpha value less than 100.
  const colorToUse = props.alpha < aThreshold ? '#000' : baseColor;
  const safeColor = tinycolor(colorToUse).setAlpha(1).toRgbString();

  // If the alpha drops below 50, always return black, else return the
  // sufficiently contrasting color.
  if (props.alpha < aThreshold) {
    return safeColor;
  } else {
    return colorFn.convert(getColorFuncString(safeColor, ` contrast(${amt})`));
  }
};

/**
 * @param {String} colorStr - A valid color string;
 *                            keyword, rgb, rgba, rrggbbaa, hsl
 * @return {Object} colorObj - A treasure trove of color information.
 */
export const getColorObj = (colorStr, adjusters = DEFAULT_ADJUSTERS) => {
  const c = tinycolor(colorStr);
  let isValid = c.isValid();

  if (isValid) {
    const baseColor = {
      format: c.getFormat(),
      hex: c.toString('hex'),
      hex3: c.toString('hex3'),
      hex6: c.toString('hex6'),
      hex8: c.toString('hex8'),
      hsl: c.toString('hsl'),
      name: c.toString('name'),
      original: c.getOriginalInput(),
      rgb: c.toString('rgb')
    };

    const newAdjusters = (adjusters === DEFAULT_ADJUSTERS) ?
      getAdjustersForColor(colorStr, adjusters) : adjusters;

    const adjustersStr = getAdjustersString(newAdjusters);
    const adjustersStrShortNames = getAdjustersString(newAdjusters, true);
    const colorFuncStr = getColorFuncString(colorStr, adjustersStr);
    const colorFuncStrShortNames = getColorFuncString(colorStr,
      adjustersStrShortNames);

    // NOTE: `css-color-function` package can't work with rrggbbaa format.
    // so we use the rgb value.
    const colorFnResult = (baseColor.format === 'hex8') ?
      colorFn.convert(getColorFuncString(baseColor.rgb, adjustersStr)) :
      colorFn.convert(colorFuncStr);

    const convertedColor = tinycolor(colorFnResult);

    const outputColor = {
      format: convertedColor.getFormat(),
      hex: convertedColor.toString('hex'),
      hex3: convertedColor.toString('hex3'),
      hex6: convertedColor.toString('hex6'),
      hex8: convertedColor.toString('hex8'),
      hsl: convertedColor.toString('hsl'),
      name: convertedColor.toString('name'),
      original: convertedColor.getOriginalInput(),
      rgb: convertedColor.toString('rgb')
    };

    return {
      adjusters: newAdjusters,
      adjustersStr,
      adjustersStrShortNames,
      baseColor,
      baseContrastColor: getContrastColor(baseColor.original),
      colorFuncStr,
      colorFuncStrShortNames,
      isValid,
      outputColor,
      outputContrastColor: getContrastColor(outputColor.original)
    };
  } else {
    return {};
  }
};
