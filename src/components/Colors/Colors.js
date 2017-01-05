import './Colors.css';

import React, {Component, PropTypes} from 'react';

class Colors extends Component {
  static propTypes = {
    inputColor: PropTypes.string.isRequired,
    inputColorDisplay: PropTypes.string.isRequired,
    inputColorOnChange: PropTypes.func,
    inputContrastColor: PropTypes.string.isRequired,
    outputColor: PropTypes.string.isRequired,
    outputContrastColor: PropTypes.string.isRequired
  }

  static defaultProps = {
    inputColorOnChange: () => {}
  }

  render() {
    const {
      inputColor,
      inputColorDisplay,
      inputColorOnChange,
      inputContrastColor,
      outputColor,
      outputContrastColor
    } = this.props;

    return (
      <div className='colors'>
        <div className='colorContainer baseColorContainer'
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
              onChange={inputColorOnChange} />
            <small>Base hex, rgb(a), or keyword color</small>
          </div>
        </div>

        <div className='colorContainer outputColorContainer'
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
            <small>Output color</small>
          </div>
        </div>
      </div>
    );
  };
}

export default Colors;
