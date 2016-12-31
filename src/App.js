import {
  DEFAULT_ADJUSTERS,
  DEFAULT_BASE_COLOR,
} from 'constants';
import React, { Component } from 'react';
import {findIndex, propEq} from 'ramda';
import {
  getAdjustersForColor,
  getAdjustersString,
  getColorFromQueryVal,
  getColorFuncString,
} from 'utils/color';

import color from 'color';
import colorFn from 'css-color-function';

class App extends Component {
  state = {
    adjusters: getAdjustersForColor(DEFAULT_BASE_COLOR, DEFAULT_ADJUSTERS),
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
        adjusters: getAdjustersForColor(baseColor, DEFAULT_ADJUSTERS),
        inputColor: baseColor,
        inputColorDisplay: baseColor,
        outputColor: baseColor
      })
    }
  }

  inputColorOnChange = (event) => {
    const {
      adjusters
    } = this.state;

    const nextBaseColor = event.target.value;
    try {
      color(nextBaseColor);

      const nextAdjusters = getAdjustersForColor(nextBaseColor, adjusters);
      const adjustersStr = getAdjustersString(nextAdjusters);
      const colorFuncStr = getColorFuncString(nextBaseColor, adjustersStr);
      const converted = colorFn.convert(colorFuncStr) || nextBaseColor;

      this.setState({
        adjusters: nextAdjusters,
        colorFuncStr: colorFuncStr,
        inputColor: nextBaseColor,
        inputColorDisplay: nextBaseColor,
        outputColor: converted
      });
    } catch(err) {
      this.setState({
        inputColorDisplay: nextBaseColor
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
    const adjuster = nextAdjusters[index];

    if (isToggle) {
      adjuster.enabled = !nextAdjusters[index].enabled;
    } else {
      adjuster.value = event.target.value;
    }

    const adjustersStr = getAdjustersString(nextAdjusters);
    const colorFuncStr = getColorFuncString(inputColor, adjustersStr);
    const converted = colorFn.convert(colorFuncStr) || inputColor;

    this.setState({
      adjusters: nextAdjusters,
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
