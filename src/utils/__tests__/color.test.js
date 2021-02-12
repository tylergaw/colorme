import * as C from "../color";

import { DEFAULT_ADJUSTERS } from "../../constants";
import tinycolor from "tinycolor2";

describe("#getHslObjFromStr", () => {
  it("gets the correct object for an hsl string", () => {
    expect(C.getHslObjFromStr("hsl(270, 82%, 70%)")).toEqual({
      h: 270,
      s: 82,
      l: 70,
    });
  });

  it("gets the correct object for an hsla string", () => {
    expect(C.getHslObjFromStr("hsla(301, 81%, 54%, 0.45)")).toEqual({
      h: 301,
      s: 81,
      l: 54,
    });
  });
});

describe("#getColorProperties", () => {
  const hex = "#b577f2";
  const rgb = "rgb(181, 119, 242)";
  const rgba = "rgba(181, 119, 242, 0.6)";
  const hsl = "hsl(270, 82%, 70%)";
  const hsla = "hsla(270, 82%, 70%, 0.45)";

  let expectedProps = {
    alpha: 100,
    hue: 270,
    lightness: 70,
    saturation: 82,
    blackness: 5,
    whiteness: 46,
    red: 181,
    green: 119,
    blue: 242,
  };

  it("gets the correct props and values for a hex color", () => {
    const props = C.getColorProperties(hex);
    expect(props).toEqual(expectedProps);
  });

  it("gets the correct props and values for an rgb color", () => {
    const props = C.getColorProperties(rgb);
    expect(props).toEqual(expectedProps);
  });

  it("gets the correct props and values for an rgba color", () => {
    let expectedRgbaProps = { ...expectedProps };
    expectedRgbaProps.alpha = 60;
    const props = C.getColorProperties(rgba);
    expect(props).toEqual(expectedRgbaProps);
  });

  it("gets the correct props and values for an hsl color", () => {
    const expectedProps = {
      alpha: 100,
      hue: 270,
      lightness: 70,
      saturation: 82,
      blackness: 5,
      whiteness: 45,
      red: 178,
      green: 115,
      blue: 241,
    };

    const props = C.getColorProperties(hsl);
    expect(props).toEqual(expectedProps);
  });

  it("gets the correct props and values for an hsla color", () => {
    const expectedProps = {
      alpha: 45,
      hue: 270,
      lightness: 70,
      saturation: 82,
      blackness: 5,
      whiteness: 45,
      red: 178,
      green: 115,
      blue: 241,
    };

    const props = C.getColorProperties(hsla);
    expect(props).toEqual(expectedProps);
  });

  it("should never change values from what was input", () => {
    const hsl = "hsl(100, 19%, 20%)";
    const hslTwo = "hsl(110, 21%, 20%)";

    const expectedProps = {
      alpha: 100,
      hue: 100,
      lightness: 20,
      saturation: 19,
      blackness: 76,
      whiteness: 16,
      red: 47,
      green: 60,
      blue: 41,
    };

    const props = C.getColorProperties(hsl);

    const expectedPropsTwo = {
      alpha: 100,
      hue: 110,
      lightness: 20,
      saturation: 21,
      blackness: 75,
      whiteness: 15,
      red: 43,
      green: 61,
      blue: 40,
    };

    const propsTwo = C.getColorProperties(hslTwo);

    expect(props).toEqual(expectedProps);
    expect(propsTwo).toEqual(expectedPropsTwo);
  });
});

describe("#getAdjustersForColor", () => {
  const hex = "#b577f2";
  const expectedAdjusters = [
    {
      enabled: false,
      name: "alpha",
      shortName: "a",
      unit: "%",
      value: 100,
    },
    {
      enabled: false,
      name: "hue",
      max: 360,
      shortName: "h",
      value: 270,
    },
    {
      enabled: false,
      name: "saturation",
      unit: "%",
      shortName: "s",
      value: 82,
    },
    {
      enabled: false,
      name: "lightness",
      unit: "%",
      shortName: "l",
      value: 70,
    },
    {
      enabled: false,
      name: "tint",
      unit: "%",
      value: 0,
    },
    {
      enabled: false,
      name: "shade",
      unit: "%",
      value: 0,
    },
    {
      enabled: false,
      name: "red",
      max: 255,
      value: 181,
    },
    {
      enabled: false,
      name: "green",
      max: 255,
      value: 119,
    },
    {
      enabled: false,
      name: "blue",
      max: 255,
      value: 242,
    },
    {
      enabled: false,
      name: "whiteness",
      unit: "%",
      shortName: "w",
      value: 46,
    },
    {
      enabled: false,
      name: "blackness",
      unit: "%",
      shortName: "b",
      value: 5,
    },
    {
      enabled: false,
      name: "contrast",
      unit: "%",
      value: 0,
    },
  ];

  it("gets the correct adjusters for a color", () => {
    expect(C.getAdjustersForColor(hex, DEFAULT_ADJUSTERS)).toEqual(
      expectedAdjusters
    );
  });
});

describe("#getColorFromQueryVal", () => {
  const hash = "#8421e6";
  const hashThree = "#842";
  const hashFour = "#f00b";
  const hashEight = "#ff0000bf";

  const hex = "8421e6";
  const hexThree = "842";
  const hexFour = "f00b";
  const hexEight = "ff0000bf";

  const hexEnc = "%238421e6";
  const hexThreeEnc = "%23842";
  const hexFourEnc = "%23f00b";
  const hexEightEnc = "%23ff0000bf";

  const rgb = "rgb(181, 119, 242)";
  const rgba = "rgb(181, 119, 242, 0.6)";
  const rgbEnc = "rgb(181,%20119,%20242)";
  const rgbaEnc = "rgb(181,%20119,%20242,%200.6)";

  const hsl = "hsl(100, 19%, 20%)";
  const hsla = "hsla(100, 19%, 20%, 0.6)";
  const hslEnc = "hsl(100,%2019%25,%2020%25)";
  const hslaEnc = "hsla(100,%2019%25,%2020%25,%200.6)";

  // Keyword colors
  it("gets the correct color from keyword colors", () => {
    expect(C.getColorFromQueryVal("red")).toEqual("red");
    expect(C.getColorFromQueryVal("yellow")).toEqual("yellow");
    expect(C.getColorFromQueryVal("navy")).toEqual("navy");
  });

  // Hex values including un-encoded "#" char
  it("gets the correct color from a hex with an un-encoded url hash", () => {
    expect(C.getColorFromQueryVal(hash)).toEqual(hash);
  });

  it("gets the correct color from a 3 digit hex with an un-encoded url hash", () => {
    expect(C.getColorFromQueryVal(hashThree)).toEqual(hashThree);
  });

  it("gets the correct color from a 4 digit hex with an un-encoded url hash", () => {
    expect(C.getColorFromQueryVal(hashFour)).toEqual(hashFour);
  });

  it("gets the correct color from a 8 digit hex with an un-encoded url hash", () => {
    expect(C.getColorFromQueryVal(hashEight)).toEqual(hashEight);
  });

  // Hex values that do not include a "#" char
  it("gets the correct color from a hex without a # char", () => {
    expect(C.getColorFromQueryVal(hex)).toEqual(hash);
  });

  it("gets the correct color from a 3 digit hex without a # char", () => {
    expect(C.getColorFromQueryVal(hexThree)).toEqual(hashThree);
  });

  it("gets the correct color from a 4 digit hex without a # char", () => {
    expect(C.getColorFromQueryVal(hexFour)).toEqual(hashFour);
  });

  it("gets the correct color from an 8 digit hex without a # char", () => {
    expect(C.getColorFromQueryVal(hexEight)).toEqual(hashEight);
  });

  // Hex values that include a url encoded "#" (%23) char
  it("gets the correct color from a hex with url encoded # char", () => {
    expect(C.getColorFromQueryVal(hexEnc)).toEqual(hash);
  });

  it("gets the correct color from a 3 digit hex with url encoded # char", () => {
    expect(C.getColorFromQueryVal(hexThreeEnc)).toEqual(hashThree);
  });

  it("gets the correct color from a 4 digit hex with url encoded # char", () => {
    expect(C.getColorFromQueryVal(hexFourEnc)).toEqual(hashFour);
  });

  it("gets the correct color from a 8 digit hex with url encoded # char", () => {
    expect(C.getColorFromQueryVal(hexEightEnc)).toEqual(hashEight);
  });

  // rgb values
  it("gets the correct color from un-encoded rgb(a) strings", () => {
    expect(C.getColorFromQueryVal(rgb)).toEqual(rgb);
    expect(C.getColorFromQueryVal(rgba)).toEqual(rgba);
  });

  it("gets the correct color from encoded rgb(a) strings", () => {
    expect(C.getColorFromQueryVal(rgbEnc)).toEqual(rgb);
    expect(C.getColorFromQueryVal(rgbaEnc)).toEqual(rgba);
  });

  // hsl values
  it("gets the correct color from un-encoded hsl(a) strings", () => {
    expect(C.getColorFromQueryVal(hsl)).toEqual(hsl);
    expect(C.getColorFromQueryVal(hsla)).toEqual(hsla);
  });

  it("gets the correct color from encoded hsl(a) strings", () => {
    expect(C.getColorFromQueryVal(hslEnc)).toEqual(hsl);
    expect(C.getColorFromQueryVal(hslaEnc)).toEqual(hsla);
  });
});

describe("#getContrastColor", () => {
  it("returns black if the base color is light", () => {
    expect(C.getContrastColor("yellow")).toEqual("rgb(0, 0, 0)");
  });

  it("returns black if the base color alpha is too low", () => {
    expect(C.getContrastColor("rgba(0, 0, 0, 0.49)")).toEqual("rgb(0, 0, 0)");
  });

  it("returns white if the base color is dark", () => {
    expect(C.getContrastColor("rgb(75, 7, 7)")).toEqual("rgb(255, 255, 255)");
  });

  it("returns white if the base color is black and alpha is high enough", () => {
    expect(C.getContrastColor("rgba(0, 0, 0, 0.51)")).toEqual(
      "rgb(255, 255, 255)"
    );
  });
});

describe("#getAdjustersString", () => {
  // Creates a clone of the default adjusters
  // NOTE: need to do this so each object is a clone too.
  let adjusters = DEFAULT_ADJUSTERS.map((a) => {
    return { ...a };
  });

  it("returns an empty string for the default adjusters", () => {
    expect(C.getAdjustersString(DEFAULT_ADJUSTERS)).toEqual("");
  });

  it("returns the correct adjusters string", () => {
    // alpha
    adjusters[0].enabled = true;
    adjusters[0].value = "60";

    // tint
    adjusters[4].enabled = true;
    adjusters[4].value = "20";

    expect(C.getAdjustersString(adjusters).trim()).toEqual(
      "alpha(60%) tint(20%)"
    );
  });

  it("returns the correct adjusters string with short names if available", () => {
    // alpha | a
    adjusters[0].enabled = true;
    adjusters[0].value = "60";

    // saturation | s
    adjusters[2].enabled = true;
    adjusters[2].value = "80";

    // tint
    adjusters[4].enabled = true;
    adjusters[4].value = "20";
    expect(C.getAdjustersString(adjusters, true).trim()).toEqual(
      "a(60%) s(80%) tint(20%)"
    );
  });
});

describe("#getColorFormats", () => {
  // Convenience method.
  const formatsList = (colorObj) =>
    Object.keys(C.getColorFormats(colorObj).formats);

  const color1 = tinycolor("black");
  expect(formatsList(color1)).toEqual([
    "hex",
    "hex3",
    "hex4",
    "hex8",
    "hsl",
    "keyword",
    "rgb",
  ]);

  const color2 = tinycolor("rgba(300, 100, 70, 0.9)");
  expect(formatsList(color2)).toEqual(["hex8", "hsl", "rgb"]);

  const color3 = tinycolor("#51a129");
  expect(formatsList(color3)).toEqual(["hex", "hex8", "hsl", "rgb"]);

  const color4 = tinycolor("hsl(300, 20%, 40%)");
  expect(formatsList(color4)).toEqual(["hex", "hex8", "hsl", "rgb"]);

  const color5 = tinycolor("hsl(360, 100%, 50%)");
  expect(formatsList(color5)).toEqual([
    "hex",
    "hex3",
    "hex4",
    "hex8",
    "hsl",
    "keyword",
    "rgb",
  ]);
});
