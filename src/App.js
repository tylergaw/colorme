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
  getContrastColor,
} from 'utils/color';

import Adjuster from 'Adjuster';
import color from 'color';
import colorFn from 'css-color-function';

class App extends Component {
  state = {
    adjusters: getAdjustersForColor(DEFAULT_BASE_COLOR, DEFAULT_ADJUSTERS),
    colorFuncStr: '',
    inputColor: DEFAULT_BASE_COLOR,
    inputContrastColor: getContrastColor(DEFAULT_BASE_COLOR),
    inputColorDisplay: DEFAULT_BASE_COLOR,
    outputColor: DEFAULT_BASE_COLOR,
    outputContrastColor: getContrastColor(DEFAULT_BASE_COLOR)
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
        inputContrastColor: getContrastColor(baseColor),
        outputColor: baseColor,
        outputContrastColor: getContrastColor(baseColor)
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
      const outputColor = colorFn.convert(colorFuncStr) || nextBaseColor;

      this.setState({
        adjusters: nextAdjusters,
        colorFuncStr: colorFuncStr,
        inputColor: nextBaseColor,
        inputContrastColor: getContrastColor(nextBaseColor),
        inputColorDisplay: nextBaseColor,
        outputColor,
        outputContrastColor: getContrastColor(outputColor)
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
      adjuster.value = parseInt(event.target.value, 10);
    }

    const adjustersStr = getAdjustersString(nextAdjusters);
    const colorFuncStr = getColorFuncString(inputColor, adjustersStr);
    const outputColor = colorFn.convert(colorFuncStr) || inputColor;
    const outputContrastColor = colorFn.convert(`color(${outputColor} contrast(2%))`);

    this.setState({
      adjusters: nextAdjusters,
      colorFuncStr,
      outputColor,
      outputContrastColor
    });
  }

  render() {
    const {
      adjusters,
      colorFuncStr,
      inputColor,
      inputContrastColor,
      inputColorDisplay,
      outputColor,
      outputContrastColor
    } = this.state;

    const adjusterOptions = adjusters.map(a => {
      const props = {
        ...a,
        outputContrastColor,
        onChange: this.adjusterOnChange
      }

      return (
        <li key={`${a.name}Adjuster`}>
          <Adjuster {...props} />
        </li>
      );
    });

    return (
      <main>
        <header role='banner'>
          <h1 className='bannerTitle'>
            ColorMe
          </h1>
          <p className='bannerIntro'>
            Visualize CSS color functions. Brought to you by {' '}
            <a href='https://tylergaw.com' target='_blank'>Tyler Gaw</a>.
            {' '}Code on <a href='https://github.com/tylergaw/colorme' target='_blank'>GitHub</a>.
            {' '}Inspired by <a href='http://jim-nielsen.com/sassme/' target='_blank'>SassMe</a>.
          </p>
        </header>
        <div className='colors'>
          <div className='colorContainer'
            style={{
              backgroundColor: inputColor,
              color: inputContrastColor
            }}>

            <div className='baseColorContainer'>
              <label>
                Base color: <small>hex, rgb(a), or keyword</small>
              </label>
              <input className='colorInput baseColorInput'
                style={{
                  color: inputContrastColor
                }}
                type='text'
                value={inputColorDisplay}
                onChange={this.inputColorOnChange} />
            </div>
          </div>

          <div className='colorContainer outputColor'
            style={{
              backgroundColor: outputColor,
              color: outputContrastColor
            }}>
            <label>
              Color function:
              <small>compiled color: <code>{outputColor}</code></small>
            </label>
            <input className='colorInput'
              style={{
                color: outputContrastColor
              }}
              type='text'
              readOnly
              value={colorFuncStr} />
          </div>
        </div>

        <div className='adjusters'>
          <h3>Adjusters</h3>
          <ul className='adjustersList'>
            {adjusterOptions}
          </ul>
        </div>
      </main>
    );
  }
}

export default App;
