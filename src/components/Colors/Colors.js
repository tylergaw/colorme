import './Colors.css';

import React, {Component, PropTypes} from 'react';

class Colors extends Component {
  static propTypes = {
    baseColor: PropTypes.string.isRequired,
    baseColorDisplay: PropTypes.string.isRequired,
    baseColorOnChange: PropTypes.func,
    baseContrastColor: PropTypes.string.isRequired,
    outputColor: PropTypes.string.isRequired,
    outputContrastColor: PropTypes.string.isRequired
  }

  static defaultProps = {
    baseColorOnChange: () => {}
  }

  render() {
    const {
      baseContrastColor,
      baseColor,
      baseColorDisplay,
      baseColorOnChange,
      outputColor,
      outputContrastColor
    } = this.props;

    return (
      <div className='colors'>
        <div className='colorContainer baseColorContainer'
          style={{
            backgroundColor: baseColor,
            color: baseContrastColor
          }}>

          <div className='colorInfo'>
            <input className='resetInput colorInput'
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
