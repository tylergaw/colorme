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

import Adjuster from 'Adjuster';
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
      adjuster.value = parseInt(event.target.value, 10);
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
      const props = {
        ...a,
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
        <div className='colors'>
          <div className='colorContainer' style={{backgroundColor: inputColor}}>
            <h1>ColorMe</h1>
            <p>
              Visualize CSS color functions. Brought to you by {' '}
              <a href='https://tylergaw.com'>Tyler Gaw</a>.

              <br />
              <small>
                Inspired by <a href='http://jim-nielsen.com/sassme/'
                  target='_blank'>SassMe</a>.
              </small>
            </p>

            <label>
              Base color:
              <br /><small>hex, rgb(a), or keyword</small>
            </label>
            <input className='colorInput baseColorInput'
              type='text'
              value={inputColorDisplay}
              onChange={this.inputColorOnChange} />
          </div>

          <div className='colorContainer outputColor' style={{backgroundColor: outputColor}}>
            <label>Color function</label>
            <input className='colorInput'
              type='text'
              readOnly
              value={colorFuncStr} />

            <p>
              compiled color: <code>{outputColor}</code>
            </p>
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
