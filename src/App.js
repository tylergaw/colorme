import {
  DEFAULT_ADJUSTERS,
  DEFAULT_BASE_COLOR,
  SHORT_NAMES_KEY,
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
  constructor(props) {
    super(props);

    const {
      localStorage,
      location: {
        search
      }
    } = window;

    let baseColor = DEFAULT_BASE_COLOR;
    const useShortNames = JSON.parse(
      localStorage.getItem(SHORT_NAMES_KEY)) || false;

    if (search.indexOf('color') > -1) {
      const [,queryVal] = search.replace('?', '').split('=');
      baseColor = getColorFromQueryVal(queryVal);
    }

    this.state = {
      adjusters: getAdjustersForColor(baseColor, DEFAULT_ADJUSTERS),
      colorFuncStr: getColorFuncString(baseColor,
        getAdjustersString(DEFAULT_ADJUSTERS, useShortNames)),
      inputColor: baseColor,
      inputContrastColor: getContrastColor(baseColor),
      inputColorDisplay: baseColor,
      outputColor: baseColor,
      outputContrastColor: getContrastColor(baseColor),
      useShortNames
    };
  }

  inputColorOnChange = (event) => {
    const {
      adjusters,
      useShortNames
    } = this.state;

    const nextBaseColor = event.target.value;

    try {
      color(nextBaseColor);

      const nextAdjusters = getAdjustersForColor(nextBaseColor, adjusters);
      const adjustersStr = getAdjustersString(nextAdjusters, useShortNames);
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
      inputColor,
      useShortNames
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

    const adjustersStr = getAdjustersString(nextAdjusters, useShortNames);
    const colorFuncStr = getColorFuncString(inputColor, adjustersStr);
    const outputColor = colorFn.convert(colorFuncStr) || inputColor;

    this.setState({
      adjusters: nextAdjusters,
      colorFuncStr,
      outputColor,
      outputContrastColor: getContrastColor(outputColor)
    });
  }

  storeShortNamesOption = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const {
      adjusters,
      inputColor,
      useShortNames
    } = this.state;

    const {
      localStorage
    } = window;

    const nextUseShortNames = !useShortNames;
    localStorage.setItem(SHORT_NAMES_KEY, nextUseShortNames);

    this.setState({
      colorFuncStr: getColorFuncString(inputColor,
        getAdjustersString(adjusters, nextUseShortNames)),
      useShortNames: nextUseShortNames
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
      outputContrastColor,
      useShortNames
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
      colorFuncStr,
      shortNamesOnClick: this.storeShortNamesOption,
      useShortNames
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
