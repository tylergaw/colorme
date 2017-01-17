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

    let baseColorInput = DEFAULT_BASE_COLOR;
    const useShortNames = JSON.parse(
      localStorage.getItem(SHORT_NAMES_KEY)) || false;

    if (search.indexOf('color') > -1) {
      const [,queryVal] = search.replace('?', '').split('=');
      // getColorFromQueryVal will return `null` if it can't figure out how to
      // parse the provided queryVal color string.
      baseColorInput = getColorFromQueryVal(queryVal) || DEFAULT_BASE_COLOR;
    }

    const colorObj = getColorObj(baseColorInput);

    const {
      adjusters,
      baseColor,
      baseColor: {
        format: baseFormat,
        original
      },
      baseContrastColor,
      colorFuncStr,
      outputColor,
      outputContrastColor
    } = colorObj;

    this.state = {
      adjusters,
      baseColor,
      baseColorDisplay: original,
      baseContrastColor,
      colorFuncStr,
      colorObj,
      outputColor,
      outputContrastColor,
      outputColorDisplay: outputColor.formats[baseFormat],
      selectedFormat: baseFormat,
      useShortNames
    };
  }

  baseColorOnChange = (event) => {
    const {
      selectedFormat,
      useShortNames
    } = this.state;

    const nextBaseColor = event.target.value;
    const colorObj = getColorObj(nextBaseColor);

    if (colorObj.isValid) {
      const {
        adjusters,
        baseColor,
        baseColor: {
          format: baseFormat,
          original
        },
        baseContrastColor,
        colorFuncStr,
        colorFuncStrShortNames,
        outputColor,
        outputContrastColor
      } = colorObj;

      const nextColorFuncStr = useShortNames ? colorFuncStrShortNames :
        colorFuncStr;

      // Check to see if the new outputColor has the previously selected format.
      // If so, hold on to that selection.
      const nextSelectedFormat = outputColor.formats[selectedFormat] ?
        selectedFormat : baseFormat;

      this.setState({
        adjusters,
        baseColor,
        baseColorDisplay: original,
        baseContrastColor,
        colorFuncStr: nextColorFuncStr,
        colorObj,
        outputColor,
        outputColorDisplay: outputColor.formats[nextSelectedFormat],
        outputContrastColor,
        selectedFormat: nextSelectedFormat
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
      baseColor: prevBaseColor,
      selectedFormat,
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

    const colorObj = getColorObj(prevBaseColor.original, nextAdjusters);

    const {
      baseColor: {
        format: baseFormat
      },
      colorFuncStr,
      colorFuncStrShortNames,
      outputColor,
      outputColor: {
        formats: outputFormats
      },
      outputContrastColor
    } = colorObj;

    const nextColorFuncStr = useShortNames ? colorFuncStrShortNames :
      colorFuncStr;

    // Check to see if the new outputColor has the previously selected format.
    // If so, hold on to that selection.
    let nextSelectedFormat = 'rgb';
    if (outputFormats[selectedFormat]) {
      nextSelectedFormat = selectedFormat;
    } else if (outputFormats[baseFormat]) {
      nextSelectedFormat = baseFormat;
    }

    this.setState({
      adjusters: nextAdjusters,
      colorFuncStr: nextColorFuncStr,
      colorObj,
      outputColor: outputColor,
      outputColorDisplay: outputFormats[nextSelectedFormat],
      outputContrastColor,
      selectedFormat: nextSelectedFormat
    });
  }

  selectedFormatOnChange = (event) => {
    const {
      outputColor: {
        formats
      }
    } = this.state;

    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const format = event.target.value;

    this.setState({
      outputColorDisplay: formats[format],
      selectedFormat: format
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
      outputColorDisplay,
      outputContrastColor,
      selectedFormat,
      useShortNames
    } = this.state;

    const colorsProps = {
      baseColor,
      baseColorDisplay,
      baseColorOnChange: this.baseColorOnChange,
      baseContrastColor,
      outputColor,
      outputColorDisplay,
      outputContrastColor,
      selectedFormat,
      selectedFormatOnChange: this.selectedFormatOnChange
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
