export const DEFAULT_BASE_COLOR = `#${Math.random().toString(16).slice(2, 8)}`;

export const DEFAULT_ADJUSTERS = [
  {
    enabled: false,
    name: 'alpha',
    shortName: 'a',
    unit: '%'
  },
  {
    enabled: false,
    name: 'saturation',
    unit: '%',
    shortName: 's'
  },
  {
    enabled: false,
    name: 'hue',
    max: 360,
    shortName: 'h'
  },
  {
    enabled: false,
    name: 'lightness',
    unit: '%',
    shortName: 'l'
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
    name: 'whiteness',
    unit: '%',
    shortName: 'w'
  },
  {
    enabled: false,
    name: 'blackness',
    unit: '%',
    shortName: 'b'
  },
  {
    enabled: false,
    name: 'contrast',
    unit: '%',
    value: 0
  }
];

export const SHORT_NAMES_KEY = 'useShortNames';
