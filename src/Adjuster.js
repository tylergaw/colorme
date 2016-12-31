import React, {Component, PropTypes} from 'react';

class Adjuster extends Component {
  static propTypes = {
    enabled: PropTypes.bool.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.number.isRequired
  }

  defaultProps = {
    enabled: false,
    max: 100,
    min: 0,
    onChange: () => {}
  }

  render() {
    const {
      enabled,
      max,
      min,
      name,
      onChange,
      value
    } = this.props;

    return (
      <div>
        <label>
          <input type='checkbox' name={name} checked={enabled}
          onChange={onChange} /> {name}
        </label>
        {enabled ? (
          <div>
            <input aria-label={`${name} value`}
              type='range'
              name={`${name}Value`}
              min={min}
              max={max}
              value={value}
              onChange={onChange} />

            <input aria-label={`${name} value`}
              type='number'
              name={`${name}Value`}
              min={min}
              max={max}
              value={value}
              onChange={onChange} />
          </div>
        ) : ''}
      </div>
    );
  }
}

export default Adjuster;
