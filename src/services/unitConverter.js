/**
 * CalcX Unit Converter Service
 * 13 complete categories with exact mathematical conversion ratios.
 */

export const UNIT_CATEGORIES = {
  length: {
    name: 'Length',
    icon: 'Ruler',
    baseUnit: 'm',
    units: {
      mm: { name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      cm: { name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      m: { name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      km: { name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      in: { name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      ft: { name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      yd: { name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      mi: { name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    },
    defaultFrom: 'km',
    defaultTo: 'm',
  },

  area: {
    name: 'Area',
    icon: 'Maximize2',
    baseUnit: 'sq_m',
    units: {
      sq_mm: { name: 'Square millimeter', symbol: 'mm²', toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
      sq_cm: { name: 'Square centimeter', symbol: 'cm²', toBase: (v) => v * 1e-4, fromBase: (v) => v * 1e4 },
      sq_m: { name: 'Square meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      sq_km: { name: 'Square kilometer', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (v) => v * 1e-6 },
      sq_in: { name: 'Square inch', symbol: 'sq in', toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
      sq_ft: { name: 'Square foot', symbol: 'sq ft', toBase: (v) => v * 0.09290304, fromBase: (v) => v / 0.09290304 },
      sq_yd: { name: 'Square yard', symbol: 'sq yd', toBase: (v) => v * 0.83612736, fromBase: (v) => v / 0.83612736 },
      acre: { name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
      hectare: { name: 'Hectare', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    },
    defaultFrom: 'acre',
    defaultTo: 'sq_m',
  },

  volume: {
    name: 'Volume',
    icon: 'Box',
    baseUnit: 'L',
    units: {
      ml: { name: 'Milliliter', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      l: { name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      cubic_m: { name: 'Cubic meter', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cubic_cm: { name: 'Cubic centimeter', symbol: 'cm³', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      gallon: { name: 'Gallon (US)', symbol: 'gal', toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
      quart: { name: 'Quart (US)', symbol: 'qt', toBase: (v) => v * 0.946352946, fromBase: (v) => v / 0.946352946 },
      pint: { name: 'Pint (US)', symbol: 'pt', toBase: (v) => v * 0.473176473, fromBase: (v) => v / 0.473176473 },
      cup: { name: 'Cup (US)', symbol: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 },
      floz: { name: 'Fluid ounce (US)', symbol: 'fl oz', toBase: (v) => v * 0.0295735295625, fromBase: (v) => v / 0.0295735295625 },
    },
    defaultFrom: 'gallon',
    defaultTo: 'l',
  },

  mass: {
    name: 'Weight / Mass',
    icon: 'Scale',
    baseUnit: 'kg',
    units: {
      mg: { name: 'Milligram', symbol: 'mg', toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
      g: { name: 'Gram', symbol: 'g', toBase: (v) => v * 1e-3, fromBase: (v) => v * 1e3 },
      kg: { name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      tonne: { name: 'Metric ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      oz: { name: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
      lb: { name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      st: { name: 'Stone', symbol: 'st', toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 },
    },
    defaultFrom: 'kg',
    defaultTo: 'g',
  },

  temperature: {
    name: 'Temperature',
    icon: 'Thermometer',
    baseUnit: 'celsius',
    units: {
      c: {
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
        formula: 'Base unit',
      },
      f: {
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
        formula: '°F = (°C × 9/5) + 32',
      },
      k: {
        name: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
        formula: 'K = °C + 273.15',
      },
    },
    defaultFrom: 'c',
    defaultTo: 'f',
  },

  speed: {
    name: 'Speed',
    icon: 'Gauge',
    baseUnit: 'mps',
    units: {
      mps: { name: 'm/s', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      kmh: { name: 'km/h', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      mph: { name: 'mph', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      knot: { name: 'knot', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    },
    defaultFrom: 'kmh',
    defaultTo: 'mph',
  },

  time: {
    name: 'Time',
    icon: 'Clock',
    baseUnit: 's',
    units: {
      ms: { name: 'Millisecond', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      s: { name: 'Second', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      min: { name: 'Minute', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      h: { name: 'Hour', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      d: { name: 'Day', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      wk: { name: 'Week', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      mo: { name: 'Month (30.44d)', symbol: 'mo', toBase: (v) => v * 2629800, fromBase: (v) => v / 2629800 },
      yr: { name: 'Year (365.25d)', symbol: 'yr', toBase: (v) => v * 31557600, fromBase: (v) => v / 31557600 },
    },
    defaultFrom: 'h',
    defaultTo: 'min',
  },

  digital: {
    name: 'Digital Storage',
    icon: 'HardDrive',
    baseUnit: 'byte',
    units: {
      bit: { name: 'Bit', symbol: 'b', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
      byte: { name: 'Byte', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
      kb: { name: 'Kilobyte', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      mb: { name: 'Megabyte', symbol: 'MB', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      gb: { name: 'Gigabyte', symbol: 'GB', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      tb: { name: 'Terabyte', symbol: 'TB', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
      pb: { name: 'Petabyte', symbol: 'PB', toBase: (v) => v * 1125899906842624, fromBase: (v) => v / 1125899906842624 },
    },
    defaultFrom: 'gb',
    defaultTo: 'mb',
  },

  pressure: {
    name: 'Pressure',
    icon: 'Compass',
    baseUnit: 'pa',
    units: {
      pa: { name: 'Pascal', symbol: 'Pa', toBase: (v) => v, fromBase: (v) => v },
      kpa: { name: 'Kilopascal', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      bar: { name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
      psi: { name: 'PSI', symbol: 'psi', toBase: (v) => v * 6894.75729, fromBase: (v) => v / 6894.75729 },
      atm: { name: 'Atmosphere', symbol: 'atm', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
    },
    defaultFrom: 'bar',
    defaultTo: 'psi',
  },

  energy: {
    name: 'Energy',
    icon: 'Zap',
    baseUnit: 'j',
    units: {
      j: { name: 'Joule', symbol: 'J', toBase: (v) => v, fromBase: (v) => v },
      kj: { name: 'Kilojoule', symbol: 'kJ', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cal: { name: 'Calorie', symbol: 'cal', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
      kcal: { name: 'Kilocalorie', symbol: 'kcal', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
      wh: { name: 'Watt-hour', symbol: 'Wh', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      kwh: { name: 'Kilowatt-hour', symbol: 'kWh', toBase: (v) => v * 3600000, fromBase: (v) => v / 3600000 },
    },
    defaultFrom: 'kwh',
    defaultTo: 'kj',
  },

  power: {
    name: 'Power',
    icon: 'Activity',
    baseUnit: 'w',
    units: {
      w: { name: 'Watt', symbol: 'W', toBase: (v) => v, fromBase: (v) => v },
      kw: { name: 'Kilowatt', symbol: 'kW', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      mw: { name: 'Megawatt', symbol: 'MW', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      hp: { name: 'Horsepower', symbol: 'hp', toBase: (v) => v * 745.699872, fromBase: (v) => v / 745.699872 },
    },
    defaultFrom: 'kw',
    defaultTo: 'hp',
  },

  frequency: {
    name: 'Frequency',
    icon: 'Radio',
    baseUnit: 'hz',
    units: {
      hz: { name: 'Hz', symbol: 'Hz', toBase: (v) => v, fromBase: (v) => v },
      khz: { name: 'kHz', symbol: 'kHz', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      mhz: { name: 'MHz', symbol: 'MHz', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      ghz: { name: 'GHz', symbol: 'GHz', toBase: (v) => v * 1e9, fromBase: (v) => v / 1e9 },
    },
    defaultFrom: 'ghz',
    defaultTo: 'mhz',
  },

  angle: {
    name: 'Angle',
    icon: 'PieChart',
    baseUnit: 'deg',
    units: {
      deg: { name: 'Degree', symbol: '°', toBase: (v) => v, fromBase: (v) => v },
      rad: { name: 'Radian', symbol: 'rad', toBase: (v) => (v * 180) / Math.PI, fromBase: (v) => (v * Math.PI) / 180 },
      grad: { name: 'Gradian', symbol: 'grad', toBase: (v) => v * 0.9, fromBase: (v) => v / 0.9 },
    },
    defaultFrom: 'deg',
    defaultTo: 'rad',
  },
};

/**
 * Format converted number for display
 */
export function formatUnitNumber(val) {
  if (isNaN(val) || !isFinite(val)) return '0';
  if (Math.abs(val) >= 1e12 || (Math.abs(val) < 1e-6 && val !== 0)) {
    return val.toExponential(6);
  }
  // Remove floating point inaccuracies
  const fixed = Number(val.toPrecision(10));
  return fixed.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

/**
 * Converts a value from one unit to another within a given category
 */
export function convertUnits(categoryKey, fromUnitKey, toUnitKey, value) {
  const catKey = categoryKey === 'weight' ? 'mass' : categoryKey;
  const cat = UNIT_CATEGORIES[catKey];
  if (!cat) throw new Error(`Unknown category: ${categoryKey}`);

  const fromUnit = cat.units[fromUnitKey];
  const toUnit = cat.units[toUnitKey];
  if (!fromUnit || !toUnit) throw new Error(`Invalid unit keys`);

  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) {
    return {
      result: 0,
      formatted: '0',
      fromUnit,
      toUnit,
      formula: '',
    };
  }

  // Convert to base, then to target
  const inBase = fromUnit.toBase(num);
  const result = toUnit.fromBase(inBase);
  const formatted = formatUnitNumber(result);

  // Generate formula text
  let formula = '';
  if (categoryKey === 'temperature') {
    if (fromUnitKey === 'c' && toUnitKey === 'f') formula = '°F = (°C × 9/5) + 32';
    else if (fromUnitKey === 'f' && toUnitKey === 'c') formula = '°C = (°F − 32) × 5/9';
    else if (fromUnitKey === 'c' && toUnitKey === 'k') formula = 'K = °C + 273.15';
    else if (fromUnitKey === 'k' && toUnitKey === 'c') formula = '°C = K − 273.15';
    else if (fromUnitKey === 'f' && toUnitKey === 'k') formula = 'K = (°F − 32) × 5/9 + 273.15';
    else if (fromUnitKey === 'k' && toUnitKey === 'f') formula = '°F = (K − 273.15) × 9/5 + 32';
  } else {
    const singleUnitInTarget = toUnit.fromBase(fromUnit.toBase(1));
    formula = `1 ${fromUnit.symbol} = ${formatUnitNumber(singleUnitInTarget)} ${toUnit.symbol}`;
  }

  return {
    result,
    formatted,
    fromUnit,
    toUnit,
    formula,
  };
}
