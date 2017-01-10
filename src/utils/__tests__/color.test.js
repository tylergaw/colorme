import * as C from '../color';

import {
  DEFAULT_ADJUSTERS,
} from '../../constants';

describe('#getColorProperties', () => {
  const hex = '#b577f2';
  const rgb = 'rgb(181, 119, 242)';
  const rgba = 'rgb(181, 119, 242, 0.6)';

  let expectedProps = {
    alpha: 100,
    hue: 271,
    lightness: 71,
    saturation: 83,
    blackness: 6,
    whiteness: 47,
    red: 181,
    green: 119,
    blue: 242
  };

  it('gets the correct props and values for a hex color', () => {
    expect(C.getColorProperties(hex)).toEqual(expectedProps);
  });

  it('gets the correct props and values for a rgb color', () => {
    expect(C.getColorProperties(rgb)).toEqual(expectedProps);
  });

  it('gets the correct props and values for a rgba color', () => {
    let expectedRgbaProps = {...expectedProps};
    expectedRgbaProps.alpha = 60;
    expect(C.getColorProperties(rgba)).toEqual(expectedRgbaProps);
  });
});

describe('#getAdjustersForColor', () => {
  const hex = '#b577f2';
  const expectedAdjusters = [
    {
      enabled: false,
      name: 'alpha',
      shortName: 'a',
      unit: '%',
      value: 100
    },
    {
      enabled: false,
      name: 'saturation',
      unit: '%',
      shortName: 's',
      value: 83
    },
    {
      enabled: false,
      name: 'hue',
      max: 360,
      shortName: 'h',
      value: 271
    },
    {
      enabled: false,
      name: 'lightness',
      unit: '%',
      shortName: 'l',
      value: 71
    },
    {
      enabled: false,
      name: 'tint',
      unit: '%',
      value: 0
    },
    {
      enabled: false,
      name: 'shade',
      unit: '%',
      value: 0
    },
    {
      enabled: false,
      name: 'red',
      max: 255,
      value: 181
    },
    {
      enabled: false,
      name: 'green',
      max: 255,
      value: 119
    },
    {
      enabled: false,
      name: 'blue',
      max: 255,
      value: 242
    },
    {
      enabled: false,
      name: 'whiteness',
      unit: '%',
      shortName: 'w',
      value: 47
    },
    {
      enabled: false,
      name: 'blackness',
      unit: '%',
      shortName: 'b',
      value: 6
    },
    {
      enabled: false,
      name: 'contrast',
      unit: '%',
      value: 0
    }
  ];

  it('gets the correct adjusters for a color', () => {
    expect(C.getAdjustersForColor(hex, DEFAULT_ADJUSTERS)).toEqual(expectedAdjusters);
  });
});

describe('#getColorFromQueryVal', () => {
  const hash = '#8421e6';
  const hashThree = '#842';

  const hex = '8421e6';
  const encoded = '%238421e6';
  const encodedThree = '%23842';

  const rgb = 'rgb(181, 119, 242)';
  const encodedRgb = 'rgb(181,%20119,%20242)';
  const rgba = 'rgb(181, 119, 242, 0.6)';
  const encodedRgba = 'rgb(181,%20119,%20242,%200.6)';

  it('gets the correct color from keyword colors', () => {
    expect(C.getColorFromQueryVal('red')).toEqual('red');
    expect(C.getColorFromQueryVal('yellow')).toEqual('yellow');
    expect(C.getColorFromQueryVal('navy')).toEqual('navy');
  });

  it('gets the correct color from a hex with an un-encoded url hash', () => {
    expect(C.getColorFromQueryVal(hash)).toEqual(hash);
  });

  it('gets the correct color from a 3 digit hex with an un-encoded url hash', () => {
    expect(C.getColorFromQueryVal(hashThree)).toEqual(hashThree);
  });

  it('gets the correct color from a hex without a hash', () => {
    expect(C.getColorFromQueryVal(hex)).toEqual(hash);
  });

  it('gets the correct color from a hex with url encoded hash', () => {
    expect(C.getColorFromQueryVal(encoded)).toEqual(hash);
  });

  it('gets the correct color from a 3-digit hex with url encoded hash', () => {
    expect(C.getColorFromQueryVal(encodedThree)).toEqual(hashThree);
  });

  it('gets the correct color for an un-encoded rgb(a) strings', () => {
    expect(C.getColorFromQueryVal(rgb)).toEqual(rgb);
    expect(C.getColorFromQueryVal(rgba)).toEqual(rgba);
  });

  it('gets the correct color for an encoded rgb(a) strings', () => {
    expect(C.getColorFromQueryVal(encodedRgb)).toEqual(rgb);
    expect(C.getColorFromQueryVal(encodedRgba)).toEqual(rgba);
  });
});

describe('#getContrastColor', () => {
  it('returns black if the base color is light', () => {
    expect(C.getContrastColor('yellow')).toEqual('rgb(0, 0, 0)');
  });

  it('returns black if the base color alpha is too low', () => {
    expect(C.getContrastColor('rgba(0, 0, 0, 0.49)')).toEqual('rgb(0, 0, 0)');
  });

  it('returns white if the base color is dark', () => {
    expect(C.getContrastColor('rgb(75, 7, 7)')).toEqual('rgb(255, 255, 255)');
  });

  it('returns white if the base color is black and alpha is high enough', () => {
    expect(C.getContrastColor('rgba(0, 0, 0, 0.51)')).toEqual('rgb(255, 255, 255)');
  });
});

describe('#getAdjustersString', () => {
  // Creates a clone of the default adjusters
  // NOTE: need to do this so each object is a clone too.
  let adjusters = DEFAULT_ADJUSTERS.map(a => {
    return {...a}
  });

  it('returns an empty string for the default adjusters', () => {
    expect(C.getAdjustersString(DEFAULT_ADJUSTERS)).toEqual('');
  });

  it('returns the correct adjusters string', () => {
    // alpha
    adjusters[0].enabled = true;
    adjusters[0].value = '60';

    // tint
    adjusters[4].enabled = true;
    adjusters[4].value = '20';

    expect(C.getAdjustersString(adjusters).trim()).toEqual('alpha(60%) tint(20%)');
  });

  it('returns the correct adjusters string with short names if available', () => {
    // alpha | a
    adjusters[0].enabled = true;
    adjusters[0].value = '60';

    // saturation | s
    adjusters[1].enabled = true;
    adjusters[1].value = '80';

    // tint
    adjusters[4].enabled = true;
    adjusters[4].value = '20';
    expect(C.getAdjustersString(adjusters, true).trim()).toEqual('a(60%) s(80%) tint(20%)');
  });
});
