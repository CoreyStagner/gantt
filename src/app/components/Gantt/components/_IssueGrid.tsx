// React Imports
import React, {
  useState,
  // useEffect
} from 'react';

// Material Imports
// import { styled } from '@mui/material/styles';
// Helper Function Imports
import {
  dayDiff,
  monthDiff,
  getDaysInMonth,
  getDayOfWeek,
  createFormattedDateFromStr,
  createFormattedDateFromObj,
  createObjFromFormattedDate,
  getDateTimeObject,
} from './dateFunctions';

// TODO: Move this to a global location
const colorsMap = {
  TASK: '#ffab91',
  PROJ: '#4db6ac',
  STORY: '#757575',
};

// TODO: Move this to a global location
const sprintData = [
  {
    name: 'Sprint 24.1',
    startDate: '2024-12-01',
    endDate: '2024-12-14',
  },
  {
    name: 'Sprint 24.2',
    startDate: '2024-12-15',
    endDate: '2024-12-28',
  },
];

// Stylized Components
// TODO: Update the styles, and convert to custom styles
const styles = `
  .gantt_task_row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .gantt_task_row-time {
    display: flex;
    flex: 1 0 70%;
  }
`;

// TODO: Update the styles
// const customStyles = {
//   ganttTimePeriod: {
//     display: 'grid',
//     gridAutoFlow: 'column',
//     gridAutoColumns: 'minmax(30px, 1fr)',
//     outline: '0.5px solid #00000010',
//     textAlign: 'center',
//     minHeight: '40px',
//   },
//   ganttTimePeriodSpan: {
//     margin: 'auto',
//   },
//   ganttTimePeriodCell: {
//     position: 'relative',
//     outline: '0.5px solid #00000010',
//     marginTop: '0.5px',
//     width: '30px',
//     minHeight: '40px',
//   },
//   taskDuration: {
//     position: 'absolute',
//     minHeight: 'calc(40px - 1px)',
//     zIndex: '1',
//     background:
//       'linear-gradient(90deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%)',
//     borderRadius: 'var(--border-radius)',
//     boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.05)',
//     cursor: 'move',
//   },
//   header: {
//     display: 'flex',
//     flexBasis: '30%',
//     justifyContent: 'space-between',
//   },
// };

// Add interfaces for the data structures
// interface SprintData {
//   name: string;
//   startDate: string;
//   endDate: string;
// }

// interface DateObject {
//   y: number;
//   m: number;
//   d: number;
// }

// interface Issue {
//   id: string;
//   name: string;
//   issue_type: 'TASK' | 'PROJ' | 'STORY';
//   startDate?: DateObject;
//   endDate?: DateObject;
//   assigned_iteration?: number;
//   children?: Issue[];
// }

// interface TimeRange {
//   fromSelectYear: string;
//   fromSelectMonth: number;
//   toSelectYear: string;
//   toSelectMonth: number;
// }

const handleReplacingLocalIssue = async (
  newIssue: Issue,
  issues: Issue[],
  writeLocalData?: (issues: Issue[]) => void
) => {
  // Create new array with replaced issue
  const updatedIssues = issues.map((issue) =>
    issue.id === newIssue.id ? newIssue : issue
  );

  const newArr: Issue[] = [];

  // Loop over the updated issues and add them to the new flattenedarray
  updatedIssues.map((issue) => {
    // If value is already in the array, skip it
    if (newArr.filter((i) => i.id === issue.id).length > 0) {
      return;
    }
    newArr.push(issue);
    // Loop over any children and add them to the new array
    if (issue.children) {
      issue.children.map((child) => {
        if (child.id === newIssue.id) {
          newArr.push(newIssue);
        } else {
          newArr.push(child);
        }
      });
    }
    // Delete children from the issue that is getting saved
    delete issue.children;
  });
  const response = await fetch('/api/gantt/issue/updateAll', {
    method: 'POST',
    body: JSON.stringify(newArr),
  }).then((response) => {
    response.json().then((data) => {
      console.log('response', data);
    });
    if (response.ok) {
      console.log('File written successfully');
    } else {
      console.error('Error writing file');
    }
  });
  return response;
};

const handleUpdateTaskStartEndDates = (
  issue: Issue,
  newDate: string,
  issues: Issue[],
  writeLocalData?: (issues: Issue[]) => void
) => {
  // Get initial diff in days between start and end date
  const initialDiff = dayDiff(
    createFormattedDateFromObj(issue.startDate),
    createFormattedDateFromObj(issue.endDate)
  );
  if (!initialDiff) {
    console.log('Error: initialDiff is undefined');
    return;
  }
  // Create new start and end date objects
  const updatedStartDate = createObjFromFormattedDate(newDate);
  const updatedEndDate = createObjFromFormattedDate(newDate, initialDiff);
  // Create new object with updated start and end dates
  if (
    typeof updatedStartDate === 'string' ||
    typeof updatedEndDate === 'string'
  ) {
    console.log(
      'Error: updatedStartDate or updatedEndDate is a string and not an object'
    );
    return;
  }
  const updatedIssue: Issue = {
    ...issue,
    startDate: updatedStartDate,
    endDate: updatedEndDate,
  };

  // TODO: HACK: This is used to decide if the data is coming from local JSON file or a DB. Remove this when we have working env variables.
  const localData = true;
  const dev_datasource = localData ? 'local' : false;
  if (dev_datasource === 'local') {
    handleReplacingLocalIssue(updatedIssue, issues, writeLocalData);
  } else {
    // post data to API
    fetch(`/api/update/issue/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedIssue),
    }).then((response) => {
      if (response.ok) {
        console.log('Task updated successfully');
      } else {
        console.error('Task update failed');
      }
    });
  }
};

// Update TimeDuration component props
interface TimeDurationProps {
  issue: Issue;
  timeRange: TimeRange;
  issues: Issue[];
  writeLocalData?: (issues: Issue[]) => void;
}

const TimeDuration: React.FC<TimeDurationProps> = ({
  issue,
  timeRange,
  issues,
  writeLocalData,
}) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [over, setOver] = useState<{ task: string; date: string } | undefined>(
    undefined
  );
  const handleDrag = (e: React.DragEvent) => {
    setDragging(true);
  };
  const handleDragOver = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (!target.dataset.date) return;
    if (!target.dataset.task) {
      console.log('Error: target.dataset.task is undefined');
      return;
    }
    setOver({
      task: target.dataset.task,
      date: target.dataset.date,
    });
    e.stopPropagation();
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!over) {
      console.log('Error: over is undefined');
      return;
    }
    handleUpdateTaskStartEndDates(issue, over.date, issues, writeLocalData);
    // TODO: Update the issue with the new date
    setDragging(false);
    setOver(undefined);
  };
  /**
   * This function will open the modal for the task that is double clicked.
   *
   * @param {HTMLDoubleClickEvent} e
   * @param {Object} issue reference to the issue
   * @returns {void}
   */
  // const handleTimeDurationDoubleClick = (e, issue) => {
  //   e.preventDefault();
  //   if (!issue) {
  //     console.log('No issue provided');
  //     return;
  //   } else {
  //     console.log('Task found', issue);
  //     modalOptions.current.set({
  //       ...modalOptions.current,
  //       isOpen: true,
  //       modalID: issue.id,
  //     });
  //     // Pass the issue to the modal
  //   }
  // };

  // TODO: Implement the dependency_to and dependency_by
  // dependency_to: Set an alert for the issue that needs to be complete before we start this issue
  // dependency_by: Set an alert for the issue that needs this issue to be completed before we start that issue
  // const { dependency_to, dependency_by } = issue;
  // TODO: Implement we can use the day for more granular viewing
  // Configure the time range start and end months
  const startMonth = new Date(
    parseInt(timeRange.fromSelectYear),
    timeRange.fromSelectMonth
  );
  const endMonth = new Date(
    parseInt(timeRange.toSelectYear),
    timeRange.toSelectMonth
  );
  // Get iteration that the task belongs too if an iteration is given.
  const iteration =
    issue.issue_type === 'TASK' ? issue?.assigned_iteration : null;
  // Set the initial TimeDuration length
  const iterationStartTime = iteration
    ? sprintData[iteration - 1]?.startDate
    : null;
  const iterationEndTime = iteration
    ? sprintData[iteration - 1]?.endDate
    : null;
  // creating rows that span across each month provided in the time range
  const monthRows = [];
  const numMonths = monthDiff(startMonth, endMonth);

  const date_startMonth = new Date(startMonth);
  for (let i = 0; i <= numMonths; i++) {
    const curYear = date_startMonth.getFullYear();
    const curMonth = date_startMonth.getMonth() + 1;

    const currentDate = getDateTimeObject(new Date());
    if (!currentDate) {
      console.log(
        'invalid date. TODO: update where it is used to prevent errors.'
      );
    }

    const taskRows = [];
    let taskRow = [];
    const numDays = getDaysInMonth(curYear, curMonth);

    for (let j = 1; j <= numDays; j++) {
      // color weekend cells differently
      const dayOfTheWeek = getDayOfWeek(curYear, curMonth - 1, j - 1);
      // add task and date data attributes
      const formattedDate = createFormattedDateFromStr(curYear, curMonth, j);
      let timelineBlock = false;
      // We will start with one and add how many days the task is so we overcome resolve that we need it to be zero indexed.
      let dateDiff = 1;
      if (issue.startDate && issue.endDate) {
        let start_y, start_m, start_d, end_y, end_m, end_d;
        if (iterationStartTime) {
          [start_y, start_m, start_d] = iterationStartTime.split('-');
        } else {
          ({ y: start_y, m: start_m, d: start_d } = issue.startDate);
        }
        if (iterationEndTime) {
          [end_y, end_m, end_d] = iterationEndTime.split('-');
        } else {
          ({ y: end_y, m: end_m, d: end_d } = issue.endDate);
        }
        const startDate = new Date(
          createFormattedDateFromStr(start_y, start_m, start_d)
        );

        const endDate = new Date(
          createFormattedDateFromStr(end_y, end_m, end_d)
        );
        const currentDate = new Date(formattedDate);
        if (startDate.getTime() === currentDate.getTime()) {
          // Found a timeline block for this issue
          timelineBlock = true;
          // Calculating the time difference of two dates
          const time_difference = endDate.getTime() - startDate.getTime();
          // Calculating the no. of days between two dates
          const day_difference = Math.round(
            time_difference / (1000 * 3600 * 24)
          );

          dateDiff += day_difference;
        }
      }
      taskRow.push(
        <div
          data-comp='TimeDuration'
          key={`${issue.id}-${j}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            position: 'relative',
            outline: '0.5px solid #00000010',
            marginTop: '0.5px',
            width: '30px',
            minHeight: '40px',
            backgroundColor:
              over?.task === issue?.id && over?.date === formattedDate
                ? 'rgba(255, 0, 0, 0.33)'
                : j === currentDate?.day &&
                  startMonth.getMonth() + 1 + i === currentDate?.month
                ? 'rgba(255, 0, 0, 0.33)'
                : dayOfTheWeek === 'S'
                ? '#e0e0e0'
                : '#ffffff',
          }}
          data-task={issue?.id}
          data-month={startMonth.getMonth() + 1}
          data-day={j}
          data-date={formattedDate}
        >
          {/* Create task on timeline */}
          {timelineBlock ? (
            <div
              key={`time-duration-${issue.id}-${Math.random()}`}
              draggable='true'
              onDrag={handleDrag}
              tabIndex={0}
              data-task={issue?.id}
              style={{
                // ...styles.taskDuration,
                width: `calc(${dateDiff} * 100% - 1px)`,
                color: 'white',
                background: colorsMap[issue.issue_type],
                fontSize: '0.75rem',
                display: dragging ? 'none' : 'flex',
                overflow: 'hidden',
                position: 'relative',
                zIndex: '1',
                textOverflow: 'ellipsis',
                alignItems: 'center',
                height: '40px', // TODO: Should we make this a variable so one change for all?
                borderRadius: '7px',
                justifyContent: 'center',
              }}
              // onDoubleClick={(e) => handleTimeDurationDoubleClick(e, issue)}
            >
              {issue?.name}
            </div>
          ) : (
            false
          )}
        </div>
      );
    }

    taskRows.push(
      <div key={`table-rows-${i}-${issue.id}`}>
        <div
          className={`task_row_content task_row_content-${issue.id}`}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(30px, 1fr)',
            outline: '0.5px solid #00000010',
            textAlign: 'center',
            minHeight: '40px',
          }}
        >
          {taskRow}
        </div>
      </div>
    );
    monthRows.push(taskRows);
    taskRow = [];
    date_startMonth.setMonth(date_startMonth.getMonth() + 1);
  }
  return monthRows;
};

// Update IssueGrid component props
interface IssueGridProps {
  issue: Issue;
  timeRange: TimeRange;
  parent?: Issue;
  issues: Issue[];
  writeLocalData?: (issues: Issue[]) => void;
}

// Exported Components
/**
 * Display the list of issues in the header of the Gantt Chart. These headers
 * display on the left side of the Gantt Chart and have buttons to focus on
 * the issue, expand/collapse the issue and edit the selected issue.
 *
 * @param {Object} props All the properties passed to the component.
 * @param {Array} props.issues The issues that are being passed to the component.
 * @returns {JSX.Element} The JSX code for the Issue Header.
 */
export default function IssueGrid({
  issue,
  timeRange,
  parent,
  issues,
  writeLocalData,
}: IssueGridProps) {
  // Helper Functions used by this component

  // Configure the time range start and end months
  const startMonth = new Date(
    parseInt(timeRange.fromSelectYear),
    timeRange.fromSelectMonth
  );
  const endMonth = new Date(
    parseInt(timeRange.toSelectYear),
    timeRange.toSelectMonth
  );
  const numMonths = monthDiff(startMonth, endMonth) + 1;
  // Resolved HTML
  return (
    <div id='gantt_issueGrid'>
      <div
        key={`${issue?.id}-${issue.name}`}
        id={`task_row_header task_row_header-${issue?.id}`}
        className={
          parent
            ? `gantt_task_row task_row_header_child_of-${parent?.id} hidden`
            : 'gantt_task_row'
        }
        data-parent={parent?.id}
        data-comp='TaskRow'
      >
        <style jsx>{styles}</style>
        <div
          className='gantt_task_row-time_container'
          style={{ display: 'flex', flexBasis: '70%' }}
        >
          <div
            className='gantt_task_row-time'
            style={{
              gridTemplateColumns: `repeat(${numMonths}, 1fr)`,
              display: 'grid',
            }}
          >
            <TimeDuration
              key={`timeDuration-${issue.id}`}
              issue={issue}
              timeRange={timeRange}
              issues={issues}
              writeLocalData={writeLocalData}
            />
          </div>
        </div>
      </div>
      {issue?.children?.map((childIssue, idx) => (
        <IssueGrid
          key={`issueGrid-${issue.id}-${idx}`}
          issue={childIssue}
          timeRange={timeRange}
          parent={issue}
          issues={issues}
          writeLocalData={writeLocalData}
        />
      ))}
    </div>
  );
}
