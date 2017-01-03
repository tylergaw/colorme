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

import Banner from 'components/Banner';
import Colors from 'components/Colors';
import Controls from 'components/Controls';
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
    let adjuster = nextAdjusters[index];

    if (isToggle) {
      adjuster.enabled = !nextAdjusters[index].enabled;
    } else {
      adjuster.value = parseInt(event.target.value, 10);

      // If the user changes an adjuster value, enable the adjuster.
      if (!adjuster.enabled) {
        adjuster.enabled = true;
      }
    }

    const adjustersStr = getAdjustersString(nextAdjusters);
    const colorFuncStr = getColorFuncString(inputColor, adjustersStr);
    const outputColor = colorFn.convert(colorFuncStr) || inputColor;

    this.setState({
      adjusters: nextAdjusters,
      colorFuncStr,
      outputColor,
      outputContrastColor: getContrastColor(outputColor)
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

    const colorsProps = {
      inputColor,
      inputContrastColor,
      inputColorDisplay,
      inputColorOnChange: this.inputColorOnChange,
      outputColor,
      outputContrastColor
    };

    const controlsProps = {
      adjusters,
      adjusterOnChange: this.adjusterOnChange,
      colorFuncStr
    };

    return (
      <main>
        <Banner />
        <Colors {...colorsProps} />
        <Controls {...controlsProps} />
      </main>
    );
  }
}

export default App;
