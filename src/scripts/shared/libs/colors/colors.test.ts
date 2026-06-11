import { hexToRgb, rgbToHex, addColors, hexToHsl, hslToHex, shiftLightness } from './colors';

describe('hexToRgb', () => {
  it('parses 6-character hex', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    expect(hexToRgb('#5823EB')).toEqual({ r: 88, g: 35, b: 235 });
  });

  it('parses 3-character hex', () => {
    expect(hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#0F0')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#00F')).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('parses hex without hash', () => {
    expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses lowercase hex', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('returns null for invalid input', () => {
    expect(hexToRgb('')).toBeNull();
    expect(hexToRgb('#GGG')).toBeNull();
    expect(hexToRgb('#12345')).toBeNull();
    expect(hexToRgb('#1234567')).toBeNull();
    expect(hexToRgb('not-a-color')).toBeNull();
  });
});

describe('rgbToHex', () => {
  it('converts RGB to hex', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
    expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    expect(rgbToHex(88, 35, 235)).toBe('#5823eb');
  });

  it('clamps values to 0-255', () => {
    expect(rgbToHex(300, 0, 0)).toBe('#ff0000');
    expect(rgbToHex(-10, 0, 0)).toBe('#000000');
  });

  it('rounds float values', () => {
    expect(rgbToHex(10.4, 10.5, 10.6)).toBe('#0a0b0b');
  });
});

describe('addColors', () => {
  it('adds two colors channel by channel', () => {
    expect(addColors('#5823EB', '#3300FF')).toBe('#8b23ff');
    expect(addColors('#EB3F9B', '#3300FF')).toBe('#ff3fff');
    expect(addColors('#EB3F9B', '#AAAAAA')).toBe('#ffe9ff');
  });

  it('clamps channels at 255', () => {
    expect(addColors('#FFFFFF', '#000001')).toBe('#ffffff');
    expect(addColors('#FF0000', '#FF0000')).toBe('#ff0000');
  });

  it('handles 3-character hex', () => {
    expect(addColors('#F00', '#00F')).toBe('#ff00ff');
  });

  it('returns first color if second is invalid', () => {
    expect(addColors('#EB3F9B', 'invalid')).toBe('#EB3F9B');
  });

  it('returns first color if first is invalid', () => {
    expect(addColors('invalid', '#EB3F9B')).toBe('invalid');
  });

  it('adding black returns original', () => {
    const color = '#EB3F9B';
    expect(addColors(color, '#000000')).toBe(color.toLowerCase());
  });
});

describe('hexToHsl', () => {
  it('converts red', () => {
    const hsl = hexToHsl('#FF0000');
    expect(hsl).not.toBeNull();
    expect(hsl!.h).toBeCloseTo(0);
    expect(hsl!.s).toBeCloseTo(100);
    expect(hsl!.l).toBeCloseTo(50);
  });

  it('converts green', () => {
    const hsl = hexToHsl('#00FF00');
    expect(hsl).not.toBeNull();
    expect(hsl!.h).toBeCloseTo(120);
    expect(hsl!.s).toBeCloseTo(100);
    expect(hsl!.l).toBeCloseTo(50);
  });

  it('converts blue', () => {
    const hsl = hexToHsl('#0000FF');
    expect(hsl).not.toBeNull();
    expect(hsl!.h).toBeCloseTo(240);
    expect(hsl!.s).toBeCloseTo(100);
    expect(hsl!.l).toBeCloseTo(50);
  });

  it('converts white', () => {
    const hsl = hexToHsl('#FFFFFF');
    expect(hsl).not.toBeNull();
    expect(hsl!.l).toBeCloseTo(100);
  });

  it('converts black', () => {
    const hsl = hexToHsl('#000000');
    expect(hsl).not.toBeNull();
    expect(hsl!.h).toBe(0);
    expect(hsl!.s).toBe(0);
    expect(hsl!.l).toBe(0);
  });

  it('returns null for invalid input', () => {
    expect(hexToHsl('')).toBeNull();
  });
});

describe('hslToHex', () => {
  it('converts red back', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
  });

  it('converts green back', () => {
    expect(hslToHex(120, 100, 50)).toBe('#00ff00');
  });

  it('converts blue back', () => {
    expect(hslToHex(240, 100, 50)).toBe('#0000ff');
  });

  it('round-trips hex -> hsl -> hex', () => {
    const colors = ['#FF0000', '#5823EB', '#EB3F9B', '#7955F9', '#3D1FAA', '#FFD4E9'];
    for (const color of colors) {
      const hsl = hexToHsl(color);
      expect(hsl).not.toBeNull();
      const result = hslToHex(hsl!.h, hsl!.s, hsl!.l);
      expect(result).toBe(color.toLowerCase());
    }
  });
});

describe('shiftLightness', () => {
  it('lightens a color', () => {
    const result = shiftLightness('#5823EB', 20);
    const hsl = hexToHsl(result);
    expect(hsl).not.toBeNull();
    expect(hsl!.l).toBeGreaterThan(60);
    expect(hsl!.l).toBeLessThan(85);
  });

  it('darkens a color', () => {
    const result = shiftLightness('#5823EB', -20);
    const hsl = hexToHsl(result);
    expect(hsl).not.toBeNull();
    expect(hsl!.l).toBeGreaterThan(15);
    expect(hsl!.l).toBeLessThan(45);
  });

  it('does not exceed 100 lightness', () => {
    const result = shiftLightness('#FFFFFF', 20);
    expect(result).toBe('#ffffff');
  });

  it('does not go below 0 lightness', () => {
    const result = shiftLightness('#000000', -20);
    expect(result).toBe('#000000');
  });

  it('preserves hue within +/-3 degrees', () => {
    const original = hexToHsl('#5823EB');
    const shifted = hexToHsl(shiftLightness('#5823EB', 15));
    expect(original).not.toBeNull();
    expect(shifted).not.toBeNull();
    expect(Math.abs(shifted!.h - original!.h)).toBeLessThan(3);
  });

  it('returns original for invalid hex', () => {
    expect(shiftLightness('invalid', 20)).toBe('invalid');
  });
});
