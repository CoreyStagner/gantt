import React, { useState } from 'react';

import { months } from './../constants';

import {
  monthDiff,
  getDaysInMonth,
  getDayOfWeek,
  getDateTimeObject,
} from './dateFunctions';

// TODO: Clean up the styling logic
// for dynamic css styling
const styles = `
  #gantt-grid-container__time {
    display: grid;
    overflow-x: auto;
    outline: 0.5px solid var(--color-outline);
  }
  .gantt_task_row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  .task_header-details {
    display: flex;
    flex-basis: 30%;
    justify-content: space-between;
  }
  .task_header-time {
    padding-top: 25px;
    display: grid;
    width: 70%;
  }
  .task_duration {
    position: absolute;
    minheight: calc(var(--min-cell-height) / 3);
    top: calc(var(--min-cell-height) / 3);
    z-index: 1;
    background: linear-gradient(
      90deg,
      var(--color-primary-light) 0%,
      var(--color-primary-dark) 100%
    );
    border-radius: 2px;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05);
    cursor: move;
  }
  .task_duration:focus {
    outline: 1px solid black;
  }
  .dragging {
    opacity: 0.5;
  }
`;
const customStyles = {
  ganttTimePeriod: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(30px, 1fr)',
    outline: '0.5px solid var(--color-outline)',
    textAlign: 'center',
    minHeight: 'var(--min-cell-height)',
  },
  ganttTimePeriodSpan: {
    margin: 'auto',
  },
  ganttTimePeriodCell: {
    position: 'relative',
    outline: '0.5px solid var(--color-outline)',
    marginTop: '0.5px',
  },
  task_duration: {
    position: 'absolute',
    minHeight: 'calc(var(--min-cell-height) - 1px)',
    zIndex: '1',
    background:
      'linear-gradient(90deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%)',
    borderRadius: 'var(--border-radius)',
    boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.05)',
    cursor: 'move',
  },
};

// Add interfaces
interface TimeRange {
  fromSelectYear: string;
  fromSelectMonth: number;
  toSelectYear: string;
  toSelectMonth: number;
}

interface SprintDateRange {
  start: Date;
  end: Date;
  i: number;
}

interface GridHeaderProps {
  timeRange: TimeRange;
  handleXScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  gridHeaderRef: React.RefObject<HTMLDivElement>;
}

interface GridHeaderData {
  monthRows: React.ReactNode[];
  dayRows: React.ReactNode[];
  weekRows: React.ReactNode[];
  numMonths: number;
}

/**
 * TODO: Move to Helper File
 * Find the sprint that this date belongs in.
 *
 * @param {Number} year day's year
 * @param {Number} month day's month
 * @param {Number} day day's day
 * @returns {Number} sprint number
 */
const determineSprint = (
  year: number,
  month: number,
  day: number,
  sprintDateRanges: SprintDateRange[]
): number | undefined => {
  const testingDate = new Date(year, month, day);
  // make sure that we have a length of sprintDateRanges
  if (!sprintDateRanges?.length) return;
  // find the sprint that the date falls within
  const foundSprint = sprintDateRanges.filter(
    (sprint: SprintDateRange) =>
      sprint.start <= testingDate && sprint.end >= testingDate
  );
  // Deconstruct the sprint id number
  const sprint = foundSprint[0]?.i;
  // return the sprint number if sprint is found
  if (!sprint) return;
  return sprint;
};

/**
 * TODO: move to Helper File
 * @param {Object} timeRange
 * @param {Array} sprintDateRanges
 * @returns
 */
const createGridHeaderData = (
  timeRange: TimeRange,
  sprintDateRanges: SprintDateRange[]
): GridHeaderData => {
  // Create the current date
  const currentDate = getDateTimeObject(new Date());
  // Create a valid start month
  const startMonth = new Date(
    parseInt(timeRange.fromSelectYear),
    timeRange.fromSelectMonth
  );
  // Create a valid end month
  const endMonth = new Date(
    parseInt(timeRange.toSelectYear),
    timeRange.toSelectMonth
  );
  // Start at our first month
  const month = new Date(startMonth);
  // Get the number of months between the start and end month
  const numMonths = monthDiff(startMonth, endMonth) + 1;
  // Placeholders for the needed data
  const monthRows = [];
  const dayRows = [];
  let dayRow = [];
  const weekRows = [];
  let weekRow = [];
  // Loop through Each month and create the needed object
  for (let i = 0; i < numMonths; i++) {
    // create month rows
    monthRows.push(
      <div
        key={i}
        data-month={startMonth.getMonth() + 1 + i}
        style={{ ...customStyles.ganttTimePeriod, outline: '1px solid' }}
      >
        <span style={customStyles.ganttTimePeriodSpan}>
          {months[month.getMonth()].long + ' ' + month.getFullYear()}
        </span>
      </div>
    );
    // create day and week rows
    const numDays = getDaysInMonth(month.getFullYear(), month.getMonth() + 1);
    const currYear = month.getFullYear();
    const currMonth = month.getMonth() + 1;
    // Loop through each day of the month
    for (let j = 1; j <= numDays; j++) {
      const mnth = new Date(startMonth);
      const curYear = mnth.getFullYear();
      const curMonth = mnth.getMonth() + 1;
      // TODO: add this logic for weekend dates to color differently
      // TODO: also add logic to implement holiday coloring as well
      // color weekend cells differently
      const dayOfTheWeek = getDayOfWeek(curYear, curMonth - 1, j - 1);
      // Create Day of the Month cells
      dayRow.push(
        <div
          key={j}
          data-month={startMonth.getMonth() + 1}
          data-sprint={determineSprint(
            month.getFullYear(),
            startMonth.getMonth(),
            j,
            sprintDateRanges
          )}
          data-day={j}
          style={{
            ...customStyles.ganttTimePeriod,
            outline: '1px solid var(--color-transparent-33)',
            backgroundColor:
              j === currentDate?.day &&
              startMonth.getMonth() + 1 + i === currentDate?.month
                ? 'var(--color-red-transparent-33)'
                : determineSprint(
                    month.getFullYear(),
                    startMonth.getMonth(),
                    j,
                    sprintDateRanges
                  ) %
                    2 ===
                  0
                ? 'var(--color-gray-500)'
                : 'var(--color-gray-400)',
            color: 'var(--color-black)',
          }}
        >
          <span style={customStyles.ganttTimePeriodSpan}>{j}</span>
        </div>
      );
      // Create Day of the Week rows
      weekRow.push(
        <div
          key={j}
          data-month={startMonth.getMonth() + 1}
          style={{
            ...customStyles.ganttTimePeriod,
            outline: '1px solid var(--color-transparent-33)',
            fontSize: '0.5rem',
          }}
        >
          <span
            style={{
              ...customStyles.ganttTimePeriodSpan,
              color: 'var(--color-gray-600)',
            }}
          >
            {getDayOfWeek(currYear, currMonth - 1, j - 1)}
          </span>
        </div>
      );
    }
    // Create Day of the Month cells
    dayRows.push(
      <div
        key={i}
        data-month={startMonth.getMonth() + 1 + i}
        style={{ ...customStyles.ganttTimePeriod, outline: 'none' }}
      >
        {dayRow}
      </div>
    );
    // Create Day of the Week cells
    weekRows.push(
      <div
        key={i}
        data-month={startMonth.getMonth() + 1 + i}
        style={{ ...customStyles.ganttTimePeriod, outline: 'none' }}
      >
        {weekRow}
      </div>
    );
    // Reset the dayRow and weekRow
    dayRow = [];
    weekRow = [];
    // Increase the current month that we are iterating.
    month.setMonth(month.getMonth() + 1);
  }
  // Return the proper values
  return {
    monthRows,
    dayRows,
    weekRows,
    numMonths,
  };
};

export default function GridHeader({
  timeRange,
  handleXScroll,
  gridHeaderRef,
}: GridHeaderProps): React.ReactNode | null {
  const [sprintDateRanges, setSprintDateRanges] = useState<SprintDateRange[]>(
    []
  );
  // Make sure we have timeRange data before continuing.
  if (!timeRange || !Object.keys(timeRange).length) return null;
  // TODO: Add logic to determine the sprint date ranges by using a useEffect
  // Get the data to populate the Grid Header.
  const { monthRows, dayRows, weekRows, numMonths } = createGridHeaderData(
    timeRange,
    sprintDateRanges
  );
  return (
    <div
      ref={gridHeaderRef}
      onScroll={handleXScroll}
      id='gantt_grid-header'
      className='task_header-time'
      style={{
        gridTemplateColumns: `repeat(${numMonths}, 1fr)`,
        overflowX: 'scroll',
        minWidth: '100%',
      }}
    >
      <style jsx>{styles}</style>
      {monthRows}
      {weekRows}
      {dayRows}
    </div>
  );
}
