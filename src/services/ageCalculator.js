/**
 * CalcX Age Calculator Service
 * Computes exact chronological age, next birthday countdown, day of birth,
 * and lifetime statistics with leap year awareness.
 */

import { parseLocalDate, formatDisplayDate, getDaysInMonth, isLeapYear } from './dateCalculator.js';

export function calculateAge(dobStr, asOfStr) {
  const dob = parseLocalDate(dobStr);
  const asOf = parseLocalDate(asOfStr);

  if (!dob || !asOf) {
    throw new Error('Please provide valid birth date and calculation date.');
  }

  if (dob.getTime() > asOf.getTime()) {
    throw new Error('Date of birth cannot be later than the target calculation date.');
  }

  // Exact calendar age in years, months, days
  let y1 = dob.getFullYear();
  let m1 = dob.getMonth();
  let d1 = dob.getDate();

  let y2 = asOf.getFullYear();
  let m2 = asOf.getMonth();
  let d2 = asOf.getDate();

  let years = y2 - y1;
  let months = m2 - m1;
  let days = d2 - d1;

  if (days < 0) {
    months--;
    const prevMonthDays = getDaysInMonth(y2, m2 === 0 ? 12 : m2);
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Lifetime totals
  const diffMs = asOf.getTime() - dob.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Day of birth
  const dayOfBirth = dob.toLocaleDateString(undefined, { weekday: 'long' });

  // Next Birthday Calculation
  // Handle Feb 29 leap baby
  const isFeb29Baby = dob.getMonth() === 1 && dob.getDate() === 29;

  let nextBdayYear = y2;
  let nextBdayMonth = dob.getMonth();
  let nextBdayDay = dob.getDate();

  if (isFeb29Baby && !isLeapYear(nextBdayYear)) {
    // If not leap year, celebrate on Feb 28 or Mar 1 (commonly Feb 28)
    nextBdayDay = 28;
  }

  let nextBday = new Date(nextBdayYear, nextBdayMonth, nextBdayDay, 12, 0, 0);

  // If next birthday in current year has already passed
  if (nextBday.getTime() < asOf.getTime()) {
    nextBdayYear++;
    if (isFeb29Baby && !isLeapYear(nextBdayYear)) {
      nextBdayDay = 28;
    } else if (isFeb29Baby && isLeapYear(nextBdayYear)) {
      nextBdayDay = 29;
    }
    nextBday = new Date(nextBdayYear, nextBdayMonth, nextBdayDay, 12, 0, 0);
  }

  const daysToNextBday = Math.round((nextBday.getTime() - asOf.getTime()) / (1000 * 60 * 60 * 24));
  const nextBdayDayOfWeek = nextBday.toLocaleDateString(undefined, { weekday: 'long' });

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    dayOfBirth,
    dobFormatted: formatDisplayDate(dob),
    asOfFormatted: formatDisplayDate(asOf),
    nextBirthdayFormatted: formatDisplayDate(nextBday),
    nextBirthdayDayOfWeek: nextBdayDayOfWeek,
    daysToNextBirthday: daysToNextBday,
    isBirthdayToday: daysToNextBday === 0,
  };
}
