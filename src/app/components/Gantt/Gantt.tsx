'use client';

import React, { useState, useEffect, useRef } from 'react';
// import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import GanttHeader from './components/_GanttHeader';
import GanttBody from './components/_GanttBody';

// Add interfaces
// interface TimeRange {
//   fromSelectMonth: number;
//   fromSelectYear: string;
//   toSelectMonth: number;
//   toSelectYear: string;
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
//   ref_to?: string[];
//   child?: boolean;
//   parent?: string;
// }

// interface Project extends Issue {
//   name: string;
//   children: Issue[];
// }

interface GanttProps {
  localData?: Issue[];
  writeLocalData?: (data: Project[]) => void;
}

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   ...theme.applyStyles('dark', {
//     backgroundColor: '#1A2027',
//   }),
// }));

export default function Gantt({ localData }: GanttProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>({} as TimeRange);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [issuesUpdating, setIssuesUpdating] = useState<boolean>(false);
  const [newIssueData, setNewProjectData] = useState<Project[]>([]);

  const gridHeaderRef = useRef<HTMLDivElement>(null);
  const gridBodyRef = useRef<HTMLDivElement>(null);

  const handleGridHeaderScroll = (
    scroll: React.UIEvent<HTMLDivElement>
  ): void => {
    if (gridBodyRef.current) {
      gridBodyRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
    }
  };

  const handleGridBodyScroll = (
    scroll: React.UIEvent<HTMLDivElement>
  ): void => {
    if (gridHeaderRef.current) {
      gridHeaderRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
    }
  };

  const buildData = async (updatedData: Project[] = []) => {
    const results: Project[] = updatedData?.length
      ? updatedData
      : localData || [];
    if (!results?.length) return;
    // Placeholder variable for all projects
    const projects: Project[] = [];
    // Placeholder project for unassigned issues
    const unassignedProject: Project = {
      id: '0',
      name: 'Project Unassigned',
      children: [],
      issue_type: 'PROJ',
    };
    // Loop through the results and add the projects to the projects array.
    results.forEach((issue: Project) => {
      if (issue.issue_type === 'PROJ') {
        projects.push(issue as Project);
      }
    });
    // Loop through the projects and add the children to the project.
    projects.forEach((project) => {
      if (!project) {
        return;
      }
      project.children = [];
      // Loop through the returned issues and add them as children to the parent project.
      results.forEach((issue: Project) => {
        // If the issue is a child of the project, add it to the project children array.
        if (issue?.ref_to?.includes(project.id)) {
          project?.children?.push(issue as Issue);
        }
        if (!issue?.ref_to && issue.issue_type !== 'PROJ') {
          // Check to make sure the project is not already in the unassigned project
          const projectExists = unassignedProject?.children?.find(
            (child: Issue) => child.id === issue.id
          );
          // If the project does not exist in the unassigned project, add it.
          if (!projectExists) {
            unassignedProject?.children?.push(issue as Issue);
          }
        }
      });
    });
    // Add the unassigned project to the projects array
    if (
      !projects.filter((project) => project.id === 'PROJ-UNASSIGNED').length
    ) {
      projects.push(unassignedProject);
    }
    const sortedProjects = projects.sort((a, b) => {
      if (!(a?.id?.includes('-') || b?.id?.includes('-'))) {
        return +a.id - +b.id;
      } else {
        return +a.id.split('-')[1] - +b.id.split('-')[1];
      }
    });
    setProjects(sortedProjects);
    const issueCollection: Issue[] = [];
    // Organize the issues for each Project by the issue number
    sortedProjects.forEach((project) => {
      issueCollection.push(project as Issue);
      if (!project.children?.length) return;
      let sortedChildren: Issue[] = [];
      const sortingMethod = 'alpha'; // TODO: Make this changeable by the user
      if (sortingMethod === 'alpha') {
        // Organize them by the project number
        sortedChildren = project.children.sort((a, b) => {
          if (!(a?.id?.includes('-') || b?.id?.includes('-'))) {
            return +a.id - +b.id;
          } else {
            return +a.id.split('-')[1] - +b.id.split('-')[1];
          }
        });
      } else {
        // TODO: Add sorting logic to be by start date and end date.
      }
      sortedChildren.forEach((childIssue) => {
        issueCollection.push({
          ...childIssue,
          child: true,
          parent: project.id,
        });
      });
    });
    if (issueCollection.length) {
      await setIssues(issueCollection);
    }
  };

  // Get Issues from the API
  useEffect(() => {
    // By Default, set the time range to the current month and year to one month in the future.
    (async () => {
      await setTimeRange({
        fromSelectMonth: new Date().getMonth() + 0,
        fromSelectYear: '2025',
        toSelectMonth: new Date().getMonth() + 1,
        toSelectYear: '2025',
      });
    })();
    // Get the issues from the API and handle assigning to the correct project
    buildData();
  }, [localData]);

  useEffect(() => {
    if (issuesUpdating) {
      setProjects(newIssueData);
      setIssuesUpdating(false);
    }
  }, [issuesUpdating, issues, newIssueData]);

  const updateNewIssueData = (data: Project[]) => {
    setNewProjectData(data);
    setIssuesUpdating(true);
    buildData(data as Project[]);
  };

  return (
    <div id='gantt'>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid size={12}>
            <GanttHeader
              timeRange={timeRange}
              gridHeaderRef={gridHeaderRef as React.RefObject<HTMLDivElement>}
              handleXScroll={handleGridHeaderScroll}
            />
          </Grid>
          <Grid size={12}>
            <GanttBody
              issues={issues as Issue[]}
              projects={projects}
              timeRange={timeRange}
              gridBodyRef={gridBodyRef as React.RefObject<HTMLDivElement>}
              handleXScroll={handleGridBodyScroll}
              writeLocalData={(data) => updateNewIssueData(data)}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
