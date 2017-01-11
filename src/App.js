import {
  DEFAULT_BASE_COLOR,
  SHORT_NAMES_KEY,
} from 'constants';
import React, { Component } from 'react';
import {findIndex, propEq} from 'ramda';
import {
  getAdjustersString,
  getColorFromQueryVal,
  getColorFuncString,
  getColorObj,
  getContrastColor,
} from 'utils/color';

import Banner from 'components/Banner';
import Colors from 'components/Colors';
import Controls from 'components/Controls';
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
      // getColorFromQueryVal will return `null` if it can't figure out how to
      // parse the provided queryVal color string.
      baseColor = getColorFromQueryVal(queryVal) || DEFAULT_BASE_COLOR;
    }

    const colorObj = getColorObj(baseColor);
    const ogBase = colorObj.baseColor.original;

    this.state = {
      adjusters: colorObj.adjusters,
      baseColor: ogBase,
      baseColorDisplay: ogBase,
      baseContrastColor: colorObj.baseContrastColor,
      colorFuncStr: colorObj.colorFuncStr,
      outputColor: ogBase,
      outputContrastColor: colorObj.outputContrastColor,
      useShortNames
    };
  }

  baseColorOnChange = (event) => {
    const {
      useShortNames
    } = this.state;

    const nextBaseColor = event.target.value;
    const colorObj = getColorObj(nextBaseColor);

    if (colorObj.isValid) {
      const baseFormat = colorObj.baseColor.format;

      this.setState({
        adjusters: colorObj.adjusters,
        baseColor: nextBaseColor,
        baseColorDisplay: nextBaseColor,
        baseContrastColor: colorObj.baseContrastColor,
        colorFuncStr: colorObj.colorFuncStr,
        outputColor: colorObj.outputColor[baseFormat],
        outputContrastColor: colorObj.outputContrastColor
      });
    } else {
      this.setState({
        baseColorDisplay: nextBaseColor
      });
    }
  }

  adjusterOnChange = (event) => {
    const {
      adjusters,
      baseColor,
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
    const colorFuncStr = getColorFuncString(baseColor, adjustersStr);
    const outputColor = colorFn.convert(colorFuncStr) || baseColor;

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
      baseColor,
      useShortNames
    } = this.state;

    const {
      localStorage
    } = window;

    const nextUseShortNames = !useShortNames;
    localStorage.setItem(SHORT_NAMES_KEY, nextUseShortNames);

    this.setState({
      colorFuncStr: getColorFuncString(baseColor,
        getAdjustersString(adjusters, nextUseShortNames)),
      useShortNames: nextUseShortNames
    });
  }

  render() {
    const {
      adjusters,
      baseColor,
      baseColorDisplay,
      baseContrastColor,
      colorFuncStr,
      outputColor,
      outputContrastColor,
      useShortNames
    } = this.state;

    const colorsProps = {
      baseColor,
      baseColorDisplay,
      baseColorOnChange: this.baseColorOnChange,
      baseContrastColor,
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
