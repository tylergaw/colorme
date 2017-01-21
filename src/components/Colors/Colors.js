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
      <div className='colorPickerContainer'>
        <input type='color'
          value={colorPickerHex}
          onChange={baseColorOnChange} />

        <svg xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 30'
          width='24'
          height='30'>
          <title>
            A color picker icon
          </title>
          <description>
            Icon by Denis Klyuchnikov from the Noun Project
          </description>
          <path fill={baseContrastColor}
            d='M1 20.303c0 1.467 1.125 2.667 2.5 2.667S6 21.77 6 20.303c0-1.467-2.5-5.333-2.5-5.333S1 18.836 1 20.303zm20.085-10.54l-5.877-5.878c-.392-.392-.86-.658-1.36-.798l.92-.92c.316-.315.315-.82.003-1.133-.31-.314-.82-.31-1.13.003L9.825 4.85c-.014.015-.028.03-.04.046l-4.87 4.866c-1.22 1.22-1.22 3.197 0 4.416l5.878 5.877c1.22 1.22 3.2 1.22 4.42 0l5.876-5.877c1.22-1.22 1.22-3.197 0-4.416zM5.6 12c0-.39.15-.78.447-1.077l5.876-5.876c.596-.596 1.558-.596 2.154 0l5.876 5.876c.298.298.447.687.447 1.077H5.6z' />
        </svg>
      </div>
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
