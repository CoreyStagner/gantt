import { days } from '../constants';

export function monthDiff(firstMonth, lastMonth) {
  let months;
  months = (lastMonth.getFullYear() - firstMonth.getFullYear()) * 12;
  months -= firstMonth.getMonth();
  months += lastMonth.getMonth();
  return months <= 0 ? 0 : months;
}

export function dayDiff(startDate, endDate) {
  const difference =
    new Date(endDate).getTime() - new Date(startDate).getTime();
  const days = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
  return days;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function getDayOfWeek(year, month, day) {
  const daysOfTheWeekArr = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayOfTheWeekIndex = new Date(year, month, day).getDay();
  return daysOfTheWeekArr[dayOfTheWeekIndex];
}

export function createObjFromFormattedDate(dateStr, daysOffset) {
  console.log(dateStr, daysOffset);
  if (!dateStr) {
    console.log(
      '[ERR] createObjFromFormattedDate: Date not formatted correctly.'
    );
    return 'DATE_ERROR';
  }
  const date = new Date(dateStr);
  if (daysOffset) {
    date.setDate(date.getDate() + daysOffset);
    return {
      y: date.getFullYear(),
      m: date.getMonth() + 1, // to resolve the zero index that new Date uses
      d: date.getDate(),
    };
  } else {
    const dateArr = dateStr.split('-');
    return {
      y: parseInt(dateArr[0]),
      m: parseInt(dateArr[1]),
      d: parseInt(dateArr[2]),
    };
  }
}
export function createFormattedDateFromObj(dateObj) {
  console.log(dateObj);
  if (!dateObj || !dateObj.y || !dateObj.m || !dateObj.d) {
    console.log(
      '[ERR] createFormattedDateFromObj: Date not formatted correctly.'
    );
    return 'DATE_ERROR';
  }
  let monthStr = dateObj.m.toString();
  let dayStr = dateObj.d.toString();

  if (monthStr.length === 1) {
    monthStr = `0${monthStr}`;
  }
  if (dayStr.length === 1) {
    dayStr = `0${dayStr}`;
  }
  return `${dateObj.y}-${monthStr}-${dayStr}`;
}
export function createFormattedDateFromStr(year, month, day) {
  if (!year || !month || !day) {
    // console.log(
    //   '[ERR] createFormattedDateFromStr: Date not formatted correctly.'
    // );
    return 'DATE_ERROR';
  }
  let monthStr = month.toString();
  let dayStr = day.toString();

  if (monthStr.length === 1) {
    monthStr = `0${monthStr}`;
  }
  if (dayStr.length === 1) {
    dayStr = `0${dayStr}`;
  }
  return `${year}-${monthStr}-${dayStr}`;
}

export function createFormattedDateFromDate(date) {
  let monthStr = (date.getMonth() + 1).toString();
  let dayStr = date.getDate().toString();

  if (monthStr.length === 1) {
    monthStr = `0${monthStr}`;
  }
  if (dayStr.length === 1) {
    dayStr = `0${dayStr}`;
  }
  return `${date.getFullYear()}-${monthStr}-${dayStr}`;
}

/**
 * Check to make sure the value passed in is a valid date Object.
 *
 * @param {Date} date A value that we will verify if it is a valid date Object.
 * @returns {Boolean} Returns true if the value is a valid date Object.
 */
export function checkValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

/**
 * Get the date and time of the date passed in.
 *
 * @param {Date} date A date Object that we will use to get the date and time.
 */
export function getDateTimeObject(date) {
  let result = null;

  if (date) {
    // Get the date and time of the date passed in
    // First check to make sure the date is valid
    if (!checkValidDate(date)) {
      console.log('[ERR] getDateTimeObject: Invalid date provided.');
      return;
    }
    result = {
      year: new Date(date).getFullYear(),
      month: new Date(date).getMonth() + 1,
      day: new Date(date).getDate(),
      hours: new Date(date).getHours(),
      minutes: new Date(date).getMinutes(),
      seconds: new Date(date).getSeconds,
    };
  } else {
    // Get the date and time of the current date and time.
    result = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
      seconds: new Date().getSeconds,
    };
  }
  // Verify that we have a result and that it is an object.
  if (!result || typeof result !== 'object') {
    console.log(
      '[ERR] getDateTimeObject: An invalid response was provided. Expected an Object.',
      result
    );
    return;
  }

  return result;
}
