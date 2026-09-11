/**
 * CalcX Date Calculator Service
 * Timezone-safe local calendar arithmetic for differences, offsets, and day-of-week analysis.
 */

// Helper to parse 'YYYY-MM-DD' safely in local time at noon to eliminate DST shifts
export function parseLocalDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day, 12, 0, 0);
}

// Format Date object to 'YYYY-MM-DD'
export function formatToISODate(date) {
  if (!date || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Format for human display (e.g. "Friday, September 11, 2026")
export function formatDisplayDate(date) {
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Checks if year is a leap year
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Gets days in a specific month (1-indexed month)
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Function A: Date Difference
 */
export function calculateDateDifference(startDateStr, endDateStr) {
  const d1 = parseLocalDate(startDateStr);
  const d2 = parseLocalDate(endDateStr);

  if (!d1 || !d2) {
    throw new Error('Please provide valid start and end dates.');
  }

  // Ensure dStart <= dEnd
  const isReversed = d1.getTime() > d2.getTime();
  const start = isReversed ? d2 : d1;
  const end = isReversed ? d1 : d2;

  // Calculate total differences
  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysInWeek = totalDays % 7;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Calendar year, month, day breakdown
  let y1 = start.getFullYear();
  let m1 = start.getMonth(); // 0-indexed
  let day1 = start.getDate();

  let y2 = end.getFullYear();
  let m2 = end.getMonth();
  let day2 = end.getDate();

  let years = y2 - y1;
  let months = m2 - m1;
  let days = day2 - day1;

  if (days < 0) {
    months--;
    // Days in previous month
    const prevMonthDays = getDaysInMonth(y2, m2 === 0 ? 12 : m2);
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    isReversed,
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    remainingDaysInWeek,
    totalHours,
    totalMinutes,
    startDateFormatted: formatDisplayDate(d1),
    endDateFormatted: formatDisplayDate(d2),
  };
}

/**
 * Function B: Add/Subtract Time from Date
 */
export function addSubtractDate(startDateStr, amount, unit, operation = 'add') {
  const date = parseLocalDate(startDateStr);
  if (!date) {
    throw new Error('Invalid start date');
  }

  const num = parseInt(amount, 10);
  if (isNaN(num)) {
    throw new Error('Please enter a valid number of units');
  }

  const sign = operation === 'subtract' ? -1 : 1;
  const target = new Date(date.getTime());

  if (unit === 'days') {
    target.setDate(target.getDate() + sign * num);
  } else if (unit === 'weeks') {
    target.setDate(target.getDate() + sign * num * 7);
  } else if (unit === 'months') {
    const currentDay = target.getDate();
    target.setDate(1); // Set to 1st to prevent rollover
    target.setMonth(target.getMonth() + sign * num);
    const maxDaysInTargetMonth = getDaysInMonth(target.getFullYear(), target.getMonth() + 1);
    target.setDate(Math.min(currentDay, maxDaysInTargetMonth));
  } else if (unit === 'years') {
    const currentDay = target.getDate();
    const currentMonth = target.getMonth();
    target.setDate(1);
    target.setFullYear(target.getFullYear() + sign * num);
    const maxDaysInTargetMonth = getDaysInMonth(target.getFullYear(), currentMonth + 1);
    target.setMonth(currentMonth);
    target.setDate(Math.min(currentDay, maxDaysInTargetMonth));
  }

  return {
    resultDate: target,
    isoString: formatToISODate(target),
    formatted: formatDisplayDate(target),
    dayOfWeek: target.toLocaleDateString(undefined, { weekday: 'long' }),
  };
}

/**
 * Function C: Day of Week Analysis
 */
export function getDayOfWeekDetails(dateStr) {
  const date = parseLocalDate(dateStr);
  if (!date) {
    throw new Error('Invalid date');
  }

  const dayOfWeek = date.toLocaleDateString(undefined, { weekday: 'long' });
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const year = date.getFullYear();
  const leap = isLeapYear(year);

  // Day of the year
  const startOfYear = new Date(year, 0, 1, 12, 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Week number (ISO-8601 approx)
  const weekNumber = Math.ceil(dayOfYear / 7);

  return {
    dayOfWeek,
    isWeekend,
    year,
    isLeapYear: leap,
    dayOfYear,
    weekNumber,
    formatted: formatDisplayDate(date),
  };
}
