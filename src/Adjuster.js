import 'Adjuster.css';

import React, {Component, PropTypes} from 'react';

class Adjuster extends Component {
  static propTypes = {
    enabled: PropTypes.bool.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    outputContrastColor: PropTypes.string.isRequired,
    unit: PropTypes.string,
    value: PropTypes.number.isRequired
  }

  static defaultProps = {
    enabled: false,
    max: 100,
    min: 0,
    onChange: () => {},
    unit: ''
  }

  render() {
    const {
      enabled,
      max,
      min,
      name,
      onChange,
      unit,
      value
    } = this.props;

    return (
      <div className='adjuster'>
        <label className='adjusterLabel'
          htmlFor={`adjuster${name}`}>
          <input className='adjusterValCheckbox'
            id={`adjuster${name}`}
            type='checkbox'
            name={name}
            checked={enabled}
            onChange={onChange} /> {name}
        </label>
        <div className={`adjusterValue ${enabled ? '' : 'adjusterValueDisabled'}`}>
          <input className='adjusterValInput'
            aria-label={`${name} value`}
            type='text'
            name={`${name}Value`}
            min={min}
            max={max}
            value={`${value}${unit}`}
            onChange={onChange} />

          <input className='adjusterValRange'
            aria-label={`${name} value`}
            type='range'
            name={`${name}Value`}
            min={min}
            max={max}
            value={value}
            onChange={onChange} />
        </div>
      </div>
    );
  }
}

export default Adjuster;
