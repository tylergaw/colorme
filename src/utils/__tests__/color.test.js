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
  const hashFour = '#f00b';
  const hashEight = '#ff0000bf';

  const hex = '8421e6';
  const hexThree = '842';
  const hexFour = 'f00b';
  const hexEight = 'ff0000bf';

  const hexEnc = '%238421e6';
  const hexThreeEnc = '%23842';
  const hexFourEnc = '%23f00b';
  const hexEightEnc = '%23ff0000bf';

  const rgb = 'rgb(181, 119, 242)';
  const rgba = 'rgb(181, 119, 242, 0.6)';
  const rgbEnc = 'rgb(181,%20119,%20242)';
  const rgbaEnc = 'rgb(181,%20119,%20242,%200.6)';

  const hsl = 'hsl(100, 19%, 20%)';
  const hsla = 'hsla(100, 19%, 20%, 0.6)';
  const hslEnc = 'hsl(100,%2019%25,%2020%25)';
  const hslaEnc = 'hsla(100,%2019%25,%2020%25,%200.6)';

  // Keyword colors
  it('gets the correct color from keyword colors', () => {
    expect(C.getColorFromQueryVal('red')).toEqual('red');
    expect(C.getColorFromQueryVal('yellow')).toEqual('yellow');
    expect(C.getColorFromQueryVal('navy')).toEqual('navy');
  });

  // Hex values including un-encoded "#" char
  it('gets the correct color from a hex with an un-encoded url hash', () => {
    expect(C.getColorFromQueryVal(hash)).toEqual(hash);
  });

  it('gets the correct color from a 3 digit hex with an un-encoded url hash', () => {
    expect(C.getColorFromQueryVal(hashThree)).toEqual(hashThree);
  });

  it('gets the correct color from a 4 digit hex with an un-encoded url hash', () => {
    expect(C.getColorFromQueryVal(hashFour)).toEqual(hashFour);
  });

  it('gets the correct color from a 8 digit hex with an un-encoded url hash', () => {
    expect(C.getColorFromQueryVal(hashEight)).toEqual(hashEight);
  });

  // Hex values that do not include a "#" char
  it('gets the correct color from a hex without a # char', () => {
    expect(C.getColorFromQueryVal(hex)).toEqual(hash);
  });

  it('gets the correct color from a 3 digit hex without a # char', () => {
    expect(C.getColorFromQueryVal(hexThree)).toEqual(hashThree);
  });

  it('gets the correct color from a 4 digit hex without a # char', () => {
    expect(C.getColorFromQueryVal(hexFour)).toEqual(hashFour);
  });

  it('gets the correct color from an 8 digit hex without a # char', () => {
    expect(C.getColorFromQueryVal(hexEight)).toEqual(hashEight);
  });

  // Hex values that include a url encoded "#" (%23) char
  it('gets the correct color from a hex with url encoded # char', () => {
    expect(C.getColorFromQueryVal(hexEnc)).toEqual(hash);
  });

  it('gets the correct color from a 3 digit hex with url encoded # char', () => {
    expect(C.getColorFromQueryVal(hexThreeEnc)).toEqual(hashThree);
  });

  it('gets the correct color from a 4 digit hex with url encoded # char', () => {
    expect(C.getColorFromQueryVal(hexFourEnc)).toEqual(hashFour);
  });

  it('gets the correct color from a 8 digit hex with url encoded # char', () => {
    expect(C.getColorFromQueryVal(hexEightEnc)).toEqual(hashEight);
  });

  // rgb values
  it('gets the correct color from un-encoded rgb(a) strings', () => {
    expect(C.getColorFromQueryVal(rgb)).toEqual(rgb);
    expect(C.getColorFromQueryVal(rgba)).toEqual(rgba);
  });

  it('gets the correct color from encoded rgb(a) strings', () => {
    expect(C.getColorFromQueryVal(rgbEnc)).toEqual(rgb);
    expect(C.getColorFromQueryVal(rgbaEnc)).toEqual(rgba);
  });

  // hsl values
  it('gets the correct color from un-encoded hsl(a) strings', () => {
    expect(C.getColorFromQueryVal(hsl)).toEqual(hsl);
    expect(C.getColorFromQueryVal(hsla)).toEqual(hsla);
  });

  it('gets the correct color from encoded hsl(a) strings', () => {
    expect(C.getColorFromQueryVal(hslEnc)).toEqual(hsl);
    expect(C.getColorFromQueryVal(hslaEnc)).toEqual(hsla);
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
