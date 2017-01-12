import {
  DEFAULT_ADJUSTERS,
} from 'constants';
import color from 'color';
import colorFn from 'css-color-function';
import tinycolor from 'tinycolor2';

/**
 * @param {String} colorStr - A valid hex, rgb, rgba color.
 * @return {Object} An object containing the properties of the given colorStr.
 *                  properties include; rgb, hsl, hwb, alpha, lightness,
 *                  blackness, whiteness.
 */
export const getColorProperties = colorStr => {
  const colorObj = color(colorStr);
  const {valpha} = colorObj;
  const {
    r: red,
    g: green,
    b: blue
  } = colorObj.object();

  const {
    h: hue,
    s: saturation,
    l: lightness
  } = colorObj.hsl().object();

  const {
    b: blackness,
    w: whiteness
  } = colorObj.hwb().object();

  const properties = {
    alpha: valpha * 100,
    hue,
    lightness,
    saturation,
    blackness,
    whiteness,
    red,
    green,
    blue
  };

  // Round any floats up on the way out.
  return Object.keys(properties).reduce((prev, curr) => {
    prev[curr] = Math.ceil(properties[curr]);
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

  let baseColor = null;
  const decoded = decodeURIComponent(val.toLowerCase());

  // Assume the user put an non-encoded "#" in the value for a hex color.
  // Browsers will see this as window.location.hash.
  if (decoded.length === 0) {
    if (hash) {
      baseColor = hash;
    }
  // If the val is a valid hex color length, start down that path.
  } else if (decoded.length === 3 || decoded.length === 6) {
    baseColor = decoded.match('#') ? decoded : `#${decoded}`;

    // Now that we've added a '#' to the string, we test to see if this is
    // in fact a valid hex color. If not, let's assume we have a keyword
    // color and remove the "#".
    if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(baseColor)) {
      baseColor = baseColor.replace('#', '');
    }
  // If none of the above match, assume the value is valid as is and just
  // decode it.
  } else {
    baseColor = decoded;
  }

  // One last check. If the baseColor provided is invalid, the call to
  // color() here will throw an error and we fall back to default base.
  try {
    color(baseColor);
  } catch (err) {
    baseColor = null;
    console.warn(`getColorFromQueryVal couldn't figure out how to parse the
color string provided in URL: ${search}. Returning null.`.replace(/\n/gm, ' '));
  }

  return baseColor;
};

/**
 * getContrastColor - For the given baseColor, return a color with sufficient
 * contrast per WCAG Guidelines.
 *
 * @param {String} baseColor - A hex, rgb(a), or keyword color.
 * @param {String} amt - optional - The contrast amount. Default: 100%.
 * @return {String} A color with sufficient contrast to the base color or black
 *                  if the baseColor has an alpha value. less than 50.
 */
export const getContrastColor = (baseColor, amt = '100%') => {
  const aThreshold = 50;
  const props = getColorProperties(baseColor);
  const colorToUse = props.alpha < aThreshold ? '#000' : baseColor;
  const {r, g, b} = color(colorToUse).object();

  // This ensures we never use a color with an alpha value less than 100.
  const safeColor = color({r, g, b}).rgb().string();

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
  const isValid = c.isValid();

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

    // NOTE: `color` package can't work with rrggbbaa or hsl color formats.
    // getAdjustersForColor uses it and needs an rbg(a) format or it will die.
    const newAdjusters = (adjusters === DEFAULT_ADJUSTERS) ?
      getAdjustersForColor(baseColor.rgb, adjusters) : adjusters;

    const adjustersStr = getAdjustersString(newAdjusters);
    const adjustersStrShortNames = getAdjustersString(newAdjusters, true);
    const colorFuncStr = getColorFuncString(colorStr, adjustersStr);
    const colorFuncStrShortNames = getColorFuncString(colorStr,
      adjustersStrShortNames);

    // NOTE: `colorFn` can't work with rrggbbaa or hsl color formats.
    // so we need to use an rgb value.
    const colorFuncStrRgb = getColorFuncString(baseColor.rgb, adjustersStr);
    const convertedColor = tinycolor(colorFn.convert(colorFuncStrRgb));

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
      baseContrastColor: getContrastColor(baseColor.rgb),
      colorFuncStr,
      colorFuncStrShortNames,
      isValid,
      outputColor,
      outputContrastColor: getContrastColor(outputColor.rgb)
    };
  } else {
    return {};
  }
};
