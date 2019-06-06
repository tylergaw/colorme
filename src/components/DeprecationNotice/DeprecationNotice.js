import React from 'react';
import './DeprecationNotice.css';

const DeprecationNotice = () => (
  <div className='deprecation'>
    <b>* Note:</b> the CSS color function here is deprecated. New functions are in
    the works. When a spec is available we’ll get this site updated.
    See <a href="https://github.com/w3c/csswg-drafts/issues/3187#issuecomment-499126198">this Github issue</a> for background.
  </div>
);

export default DeprecationNotice;
