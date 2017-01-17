import './FormatSelect.css';

import React, {Component, PropTypes} from 'react';

class FormatSelect extends Component {
  static propTypes = {
    baseFormat: PropTypes.string.isRequired,
    outputColor: PropTypes.object.isRequired,
    selectedFormat: PropTypes.string.isRequired,
    selectedFormatOnChange: PropTypes.func
  }

  static defaultProps = {
    selectedFormatOnChange: () => {}
  }

  allFormatsAndOrder = [
    'hex',
    'hex3',
    'hex8',
    'hex4',
    'rgb',
    'hsl',
    'keyword'
  ];

  friendlyLabels = {
    hex3: 'hex (short)',
    hex4: 'rrggbbaa (short)',
    hex8: 'rrggbbaa',
    rgb: 'rgb(a)',
    hsl: 'hsl(a)'
  }

  render() {
    const {
      outputColor: {
        formats
      },
      selectedFormat,
      selectedFormatOnChange
    } = this.props;

    const availableFormats = this.allFormatsAndOrder.filter(f => !!formats[f]);
    const unavailableFormats = this.allFormatsAndOrder.filter(f => !formats[f]);

    const available = (
      <optgroup label='Available formats'>
      {
        availableFormats.map(f => {
          return (
            <option key={`format${f}`} value={f}>
              {this.friendlyLabels[f] || f}
            </option>
          );
        })
      }
      </optgroup>
    );

    const unavailable = unavailableFormats.length ? (
      <optgroup label='Unavailable formats' disabled>
      {
        unavailableFormats.map(f => {
          return (
            <option key={`format${f}`}>
              {this.friendlyLabels[f] || f}
            </option>
          );
        })
      }
      </optgroup>
    ) : '';

    return (
      <span className='formatSelectContainer'>
        <select className='formatSelect'
          onChange={selectedFormatOnChange}
          value={selectedFormat}>
          {available}
          {unavailable}
        </select>
        <svg className='formatSelectIcon'
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 20 20'>
          <path d='M10 7.75H5.67l2.165 2.625L10 13l2.165-2.625L14.33 7.75'/>
        </svg>
      </span>
    );
  };
}

export default FormatSelect;
