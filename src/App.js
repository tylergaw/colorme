import './App.css';

import React, { Component } from 'react';
import {clone, findIndex, propEq} from 'ramda';

import color from 'color';
import colorFn from 'css-color-function';
import colorString from 'color-string';

const availableAdjusters = [
  {
    enabled: false,
    name: 'alpha',
    shortName: 'a',
    unit: '%',
    value: 100
  },
  {
    enabled: false,
    name: 'hue',
    shortName: 'h',
    value: null
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
    name: 'saturation',
    shortName: 's',
    value: 0
  },
  {
    enabled: false,
    defaultValue: 0,
    name: 'contrast',
    unit: '%',
    value: 0
  }
];

const getColorReport = (inputColor) => {
  // Don't return a report if this is an invalid color.
  if (!colorString.get(inputColor)) {
    return null
  };

  const outputColorObj = color(inputColor);

  const {
    valpha: alpha,
    color: [h, s, l]
  } = outputColorObj.hsl();

  return {
    alpha: alpha * 100,
    hue: Math.ceil(h),
    saturation: Math.ceil(s),
    luminance: Math.ceil(l)
  };
};

class App extends Component {
  constructor(props) {
    super(props);

    const defaultInputColor = '#5f70ee';
    const report = getColorReport(defaultInputColor);
    const adjusters = availableAdjusters.reduce((prev, curr) => {
      const clone = {
        ...curr
      };

      const inputColorValue = report[curr.name];

      if (inputColorValue !== undefined) {
        clone.value = inputColorValue;
      }

      prev.push(clone);
      return prev;
    }, []);

    this.state = {
      adjusters,
      adjustersStr: '',
      colorFuncStr: '',
      inputColor: defaultInputColor,
      outputColor: defaultInputColor
    };
  }

  inputColorOnChange = (event) => {
    this.setState({
      inputColor: event.target.value
    });
  }

  adjusterOnChange = (event) => {
    const {
      adjusters,
      inputColor
    } = this.state;

    const isToggle = event.target.type === 'checkbox';
    const adjusterName = event.target.name.replace('Value', '');
    const nextAdjusters = clone(adjusters);
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
      `color(${inputColor} ${adjustersStr})` : '';

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
      outputColor
    } = this.state;

    console.log(outputColor);

    const adjusterOptions = adjusters.map(a => {
      const {
        enabled,
        name,
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
              <input type='number' name={`${name}Value`} min='0' max='100'
                defaultValue={value} onChange={this.adjusterOnChange} />
            </div>
          ) : ''}
        </li>
      );
    });

    return (
      <div className="app">

        <div style={{backgroundColor: inputColor}}>
          <h1>ColorMe</h1>
          <p>
            Visualize CSS color functions. Brought to you by Tyler Gaw. Inspired by SassMe
          </p>

          <label>Base color:</label>
          <input type='text' value={inputColor} onChange={this.inputColorOnChange} />
        </div>

        <div style={{backgroundColor: outputColor}}>
          <label>Color function</label>
          <input type='text' readOnly value={colorFuncStr} />
        </div>

        <ul>
          {adjusterOptions}
        </ul>
      </div>
    );
  }
}

export default App;
