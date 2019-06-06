import './Banner.css';

import React, {Component} from 'react';

class Banner extends Component {
  render() {
    return (
      <header role='banner'>
        <h1 className='bannerTitle'>
          ColorMe
        </h1>
        <p className='bannerIntro'>
          Visualize The CSS Color Function<b>*</b>.
          {' '}Made by <a href='https://tylergaw.com/articles/introducing-colorme' target='_blank' rel='noopener'>Tyler Gaw</a>.
          {' '}Code on <a href='https://github.com/tylergaw/colorme' target='_blank' rel='noopener'>GitHub</a>.
          {' '}Inspired by <a href='http://jim-nielsen.com/sassme/' target='_blank' rel='noopener'>SassMe</a>.
        </p>
      </header>
    );
  };
}

export default Banner;
