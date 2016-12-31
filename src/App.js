import React, { Component } from 'react';
import {findIndex, propEq} from 'ramda';

import color from 'color';
import colorFn from 'css-color-function';

const DEFAULT_BASE_COLOR = '#2ac20d';

const ADJUSTERS = [
  {
    enabled: false,
    name: 'alpha',
    shortName: 'a',
    unit: '%'
  },
  {
    enabled: false,
    name: 'saturation',
    unit: '%',
    shortName: 's'
  },
  {
    enabled: false,
    name: 'hue',
    max: 360,
    shortName: 'h'
  },
  {
    enabled: false,
    name: 'lightness',
    unit: '%',
    shortName: 'l'
  },
  {
    enabled: false,
    name: 'whiteness',
    unit: '%',
    shortName: 'w'
  },
  {
    enabled: false,
    name: 'blackness',
    unit: '%',
    shortName: 'b'
  },
  {
    enabled: false,
    name: 'tint',
    unit: '%',
    value: 0
  },
  {
    enabled: false,
    name: 'shade',
    unit: '%',
    value: 0
  },
  {
    enabled: false,
    name: 'contrast',
    unit: '%',
    value: 0
  }
];

/**
 * @param {String} inputColor - A valid hex, rgb, rgba color.
 * @return {Object} An object containing the properties of the given inputColor.
 *                  properties include; rgb, hsl, hwb, alpha, lightness,
 *                  blackness, whiteness.
 */
const getColorProperties = (inputColor) => {
  const colorObj = color(inputColor);
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
 * @param {String} inputColor - A valid hex, rgb, rgba color.
 * @return {Array} An array of adjuster objects customized to fit the inputColor.
 */
const getColorAdjusters = (inputColor) => {
  const colorProperties = getColorProperties(inputColor);

  return ADJUSTERS.reduce((prev, curr) => {
    const adjuster = {...curr};
    const prop = colorProperties[curr.name];

    if (prop !== undefined) {
      adjuster.value = prop;
    }

    prev.push(adjuster);
    return prev;
  }, []);
};

/**
 * @param {String} val - A string that looks like a hex, rgb, or rgba color.
 * @return {String} A valid color as a string.
 */
const getColorFromQueryVal = (val) => {
  const {
    hash,
    search
  } = window.location;

  let baseColor = null;
  const decoded = decodeURIComponent(val);

  // Assume hex value with no "#" if we're at that length.
  if (val.length === 3 || val.length === 6) {
    baseColor = decoded.match('#') ? decoded : `#${val}`;
  // Assume the user put an non-encoded "#" in the value for a hex color.
  } else if (val.length === 0) {
    if (hash) {
      baseColor = hash;
    }
  } else {
    baseColor = decodeURIComponent(val);
  }

  // One last check. If the baseColor provided is invalid, the call to
  // color() here will throw an error and we fall back to default base.
  try {
    color(baseColor);
  } catch (err) {
    baseColor = null;
    console.warn(`Invalid color provided in URL: ${search}, using default base color.`);
  }

  return baseColor;
};

class App extends Component {
  state = {
    adjusters: getColorAdjusters(DEFAULT_BASE_COLOR),
    adjustersStr: '',
    colorFuncStr: '',
    inputColor: DEFAULT_BASE_COLOR,
    inputColorDisplay: DEFAULT_BASE_COLOR,
    outputColor: DEFAULT_BASE_COLOR
  };

  componentWillMount() {
    const {
      search
    } = window.location;

    if (search.indexOf('color') > -1) {
      const [,queryVal] = search.replace('?', '').split('=');
      const baseColor = getColorFromQueryVal(queryVal) || DEFAULT_BASE_COLOR;

      this.setState({
        adjusters: getColorAdjusters(baseColor),
        inputColor: baseColor,
        inputColorDisplay: baseColor,
        outputColor: baseColor
      })
    }
  }

  inputColorOnChange = (event) => {
    const inputValue = event.target.value;
    try {
      color(inputValue);

      this.setState({
        adjusters: getColorAdjusters(inputValue),
        colorFuncStr: '',
        inputColor: inputValue,
        inputColorDisplay: inputValue,
        outputColor: inputValue
      });
    } catch(err) {
      this.setState({
        inputColorDisplay: inputValue
      });
    };
  }

  adjusterOnChange = (event) => {
    const {
      adjusters,
      inputColor
    } = this.state;

    const isToggle = event.target.type === 'checkbox';
    const adjusterName = event.target.name.replace('Value', '');
    const nextAdjusters = [...adjusters];
    const index = findIndex(propEq('name', adjusterName))(nextAdjusters);

    if (isToggle) {
      nextAdjusters[index].enabled = !nextAdjusters[index].enabled;
    } else {
      nextAdjusters[index].value = event.target.value;
    }

    const adjustersStr = nextAdjusters.reduce((prev, curr) => {
      const {
        name,
        value,
        unit = ''
      } = curr;

      if (curr.enabled) {
        return `${prev} ${name}(${value}${unit})`;
      }

      return prev;
    }, '');

    const colorFuncStr = (adjustersStr.length) ?
      `color(${inputColor}${adjustersStr})` : '';

    const converted = colorFn.convert(colorFuncStr) || inputColor;

    this.setState({
      adjusters: nextAdjusters,
      adjustersStr,
      colorFuncStr,
      outputColor: converted
    });
  }

  render() {
    const {
      adjusters,
      colorFuncStr,
      inputColor,
      inputColorDisplay,
      outputColor
    } = this.state;

    const adjusterOptions = adjusters.map(a => {
      const {
        enabled,
        name,
        max = 100,
        value
      } = a;

      return (
        <li key={`${name}Adjuster`}>
          <label>
            <input type='checkbox' name={name} checked={enabled}
            onChange={this.adjusterOnChange} /> {name}
          </label>
          {enabled ? (
            <div>
              <label>
                Value
              </label>
              <input type='number' name={`${name}Value`} min='0' max={max}
                defaultValue={value} onChange={this.adjusterOnChange} />
            </div>
          ) : ''}
        </li>
      );
    });

    return (
      <div className="app">

        <div className='colorContainer' style={{backgroundColor: inputColor}}>
          <h1>ColorMe</h1>
          <p>
            Visualize CSS color functions. Brought to you by Tyler Gaw.
            Inspired by SassMe
          </p>

          <label>Base color:</label>
          <input type='text' value={inputColorDisplay}
            onChange={this.inputColorOnChange} />
        </div>

        <div className='colorContainer' style={{backgroundColor: outputColor}}>
          <label>Color function</label>
          <input type='text' readOnly value={colorFuncStr} />

          <p>
            compiled color: <code>{outputColor}</code>
          </p>
        </div>

        <ul>
          {adjusterOptions}
        </ul>
      </div>
    );
  }
}

export default App;
