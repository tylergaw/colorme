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
import Banner from 'components/Banner';
import color from 'color';
import colorFn from 'css-color-function';

class App extends Component {
  state = {
    adjusters: getAdjustersForColor(DEFAULT_BASE_COLOR, DEFAULT_ADJUSTERS),
    colorFuncStr: getColorFuncString(DEFAULT_BASE_COLOR,
      getAdjustersString(DEFAULT_ADJUSTERS)),
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
        colorFuncStr: getColorFuncString(baseColor,
          getAdjustersString(DEFAULT_ADJUSTERS)),
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
        colorFuncStr,
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
        <Banner />
        <div className='colors'>
          <div className='colorContainer'
            style={{
              backgroundColor: inputColor,
              color: inputContrastColor
            }}>

            <div className='colorInfo'>
              <input className='resetInput colorInput'
                style={{
                  color: inputContrastColor
                }}
                type='text'
                value={inputColorDisplay}
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                onChange={this.inputColorOnChange} />
              <small>Base hex, rgb(a), or keyword color</small>
            </div>
          </div>

          <div className='colorContainer outputColor'
            style={{
              backgroundColor: outputColor,
              color: outputContrastColor
            }}>
            <div className='colorInfo'>
              <input className='resetInput colorInput'
                style={{
                  color: outputContrastColor
                }}
                type='text'
                readOnly
                value={outputColor} />
              <small>Compiled color</small>
            </div>
          </div>
        </div>

        <div className='controls'>
          <div className='colorFunc'>
            <label className='controlsHeading' htmlFor='colorFunc'>
              Color function
            </label>
            <input className='resetInput colorFuncInput'
              id='colorFunc'
              type='text'
              readOnly
              value={colorFuncStr} />
          </div>

          <div className='adjusters'>
            <h3 className='controlsHeading'>
              Adjusters
            </h3>
            <ul className='adjustersList'>
              {adjusterOptions}
            </ul>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
