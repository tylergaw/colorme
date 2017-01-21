import './Colors.css';

import React, {Component, PropTypes} from 'react';

import FormatSelect from './FormatSelect';

class Colors extends Component {
  static propTypes = {
    baseColor: PropTypes.object.isRequired,
    baseColorDisplay: PropTypes.string.isRequired,
    baseColorOnChange: PropTypes.func,
    baseContrastColor: PropTypes.string.isRequired,
    outputColor: PropTypes.object.isRequired,
    outputColorDisplay: PropTypes.string.isRequired,
    outputContrastColor: PropTypes.string.isRequired,
    selectedFormat: PropTypes.string.isRequired,
    selectedFormatOnChange: PropTypes.func
  }

  static defaultProps = {
    baseColorOnChange: () => {}
  }

  constructor(props) {
    super(props);

    this.state = {
      colorInputSupport: false
    };
  }

  componentDidMount() {
    const test = document.createElement('input');
    test.type = 'color';
    test.value = 'test';
    // Browsers with input[type='color'] will not set this value.
    const colorInputSupport = test.value !== 'test';

    this.setState({
      colorInputSupport
    });
  }

  render() {
    const {
      colorInputSupport
    } = this.state;

    const {
      baseContrastColor,
      baseColor: {
        format: baseFormat,
        formats: {
          hex8
        },
        original: ogBase
      },
      baseColorDisplay,
      baseColorOnChange,
      outputColor,
      outputColorDisplay,
      outputContrastColor,
      selectedFormat,
      selectedFormatOnChange
    } = this.props;

    const formatSelectProps = {
      baseFormat,
      outputColor,
      selectedFormat,
      selectedFormatOnChange
    };

    // For the color picker input
    // "The value property of the input must be a 7 character long string" - MDN
    const colorPickerHex = hex8.substr(0, 7);
    const colorPickerInput = colorInputSupport ? (
      <input type='color'
        value={colorPickerHex}
        onChange={baseColorOnChange} />
    ) : '';

    return (
      <div className='colors'>
        <div className='colorContainer baseColorContainer'
          style={{
            backgroundColor: ogBase,
            color: baseContrastColor
          }}>

          <div className='colorInfo'>
            {colorPickerInput}

            <input className='resetInput colorInput'
              id='inputColor'
              style={{
                color: baseContrastColor
              }}
              type='text'
              value={baseColorDisplay}
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              spellCheck='false'
              onChange={baseColorOnChange} />
            <label className='colorInputLabel'
              htmlFor='inputColor'>
              hex, rrggbbaa, rgb(a), hsl(a) or keyword color
            </label>
          </div>
        </div>

        <div className='colorContainer outputColorContainer'
          style={{
            backgroundColor: outputColor.original,
            color: outputContrastColor
          }}>
          <div className='colorInfo'>
            <input className='resetInput colorInput'
              style={{
                color: outputContrastColor
              }}
              type='text'
              readOnly
              value={outputColorDisplay} />
            <label className='colorInputLabel'>
              Output color as
              <FormatSelect {...formatSelectProps} />
            </label>
          </div>
        </div>
      </div>
    );
  };
}

export default Colors;
