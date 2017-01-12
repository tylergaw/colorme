import {
  DEFAULT_BASE_COLOR,
  SHORT_NAMES_KEY,
} from 'constants';
import React, { Component } from 'react';
import {findIndex, propEq} from 'ramda';
import {
  getColorFromQueryVal,
  getColorObj,
} from 'utils/color';

import Banner from 'components/Banner';
import Colors from 'components/Colors';
import Controls from 'components/Controls';

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
      colorObj,
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
      const {
        adjusters,
        baseColor: {
          format: baseFormat
        },
        baseContrastColor,
        colorFuncStr,
        colorFuncStrShortNames,
        outputColor,
        outputContrastColor
      } = colorObj;

      const nextColorFuncStr = useShortNames ? colorFuncStrShortNames :
        colorFuncStr;

      this.setState({
        adjusters,
        baseColor: nextBaseColor,
        baseColorDisplay: nextBaseColor,
        baseContrastColor,
        colorFuncStr: nextColorFuncStr,
        colorObj,
        outputColor: outputColor[baseFormat],
        outputContrastColor
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

    const colorObj = getColorObj(baseColor, nextAdjusters);
    const {
      baseColor: {
        format: baseFormat
      },
      colorFuncStr,
      colorFuncStrShortNames,
      outputColor,
      outputContrastColor
    } = colorObj;

    const nextColorFuncStr = useShortNames ? colorFuncStrShortNames :
      colorFuncStr;

    this.setState({
      adjusters: nextAdjusters,
      colorFuncStr: nextColorFuncStr,
      colorObj,
      outputColor: outputColor[baseFormat],
      outputContrastColor
    });
  }

  storeShortNamesOption = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const {
      colorObj: {
        colorFuncStr,
        colorFuncStrShortNames
      },
      useShortNames
    } = this.state;

    const {
      localStorage
    } = window;

    const nextUseShortNames = !useShortNames;
    const nextColorFuncStr = nextUseShortNames ? colorFuncStrShortNames :
      colorFuncStr;

    localStorage.setItem(SHORT_NAMES_KEY, nextUseShortNames);

    this.setState({
      colorFuncStr: nextColorFuncStr,
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
