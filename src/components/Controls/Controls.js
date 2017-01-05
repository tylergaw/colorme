import './Controls.css';

import React, {Component, PropTypes} from 'react';

import Adjuster from 'components/Adjuster';

class Controls extends Component {
  static propTypes = {
    adjusters: PropTypes.array.isRequired,
    adjusterOnChange: PropTypes.func,
    colorFuncStr: PropTypes.string,
    shortNamesOnClick: PropTypes.func,
    useShortNames: PropTypes.bool.isRequired
  }

  static defaultProps = {
    adjusterOnChange: () => {},
    colorFuncStr: '',
    shortNamesOnClick: () => {}
  }

  render() {
    const {
      adjusters,
      adjusterOnChange,
      colorFuncStr,
      shortNamesOnClick,
      useShortNames
    } = this.props;

    const adjusterListItems = adjusters.map(a => {
      const props = {
        ...a,
        onChange: adjusterOnChange
      }

      return (
        <li key={`${a.name}Adjuster`}>
          <Adjuster {...props} />
        </li>
      );
    });

    return (
      <div className='controls'>
        <div className='colorFunc'>
          <label className='controlsHeading' htmlFor='colorFunc'>
            Color function
            <button className='btnText' onClick={shortNamesOnClick}>
              {useShortNames ? 'Use full names' : 'Use short names' }
            </button>
          </label>
          <input className='resetInput colorFuncInput'
            id='colorFunc'
            type='text'
            readOnly
            value={colorFuncStr} />
        </div>

        <div className='adjusters'>
          <h3 className='controlsHeading'>
            Adjusters
          </h3>
          <ul className='adjustersList'>
            {adjusterListItems}
          </ul>
        </div>
      </div>
    );
  };
}

export default Controls;
