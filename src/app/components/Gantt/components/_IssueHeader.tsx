// React Imports
import React, { useState, useEffect } from 'react';
// Material Imports
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { LuCornerDownRight, LuScanEye } from 'react-icons/lu';
import { TbLayoutNavbarExpandFilled } from 'react-icons/tb';
// Utility Logic
import { getIssueColor } from './utils';

// Stylized Components
/**
 * Styled Component for the Container that surrounds the Issue Header.
 */
const IssueContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid #00000033',
  borderTop: 'none',
}));
/**
 * Styled Component for the Issue Name.
 */
const IssueNameDiv = styled('div')(({ theme }) => ({
  width: '100%',
  height: '39.35px',
  lineHeight: '39.35px',
}));
// /**
//  * Styled Component for the container that takes up the space of a button
//  * so that the spacing is even.
//  */
// const EmptyButtonDiv = styled('div')(({ theme }) => ({
//   width: '18px',
//   height: '20px',
// }));

// Add interface for component props
interface IssueHeaderProps {
  issues: Project[];
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
export default function IssueHeader({ issues }: IssueHeaderProps) {
  // Helper Functions used by this component
  /**
   * This will handle expanding or collapsing an issue, this is done by looking
   * at the classes to find all of its children and toggling the hidden class.
   *
   * @param {Object} issue The issue that is being toggled.
   */
  const handleToggleIssue = (issue: Project): void => {
    const taskRowChildren = document.querySelectorAll(`.child-${issue.id}`);
    const taskGridChildren = document.querySelectorAll(
      `.task_row_header_child_of-${issue.id}`
    );
    if (taskRowChildren || taskGridChildren) {
      [...taskRowChildren, ...taskGridChildren].forEach((taskRowChild) => {
        taskRowChild.classList.toggle('hidden');
      });
    }
  };

  // Resolved HTML
  return (
    <div id='gantt_issueHeader'>
      <Box
        sx={{
          flexGrow: 1,
          flexDirection: 'column',
          borderTop: '1px solid #00000033',
        }}
      >
        {issues.map((issue, i) => {
          if (!issue) return;
          return (
            <div
              key={`issueHeader-${issue.id}-${i}`}
              className={
                issue.child ? `issue hidden child-${issue.parent}` : 'issue'
              }
            >
              <IssueContainer
                sx={{
                  borderLeft: `5px solid ${getIssueColor(
                    issue.issue_type as string
                  )}`,
                }}
              >
                {/* This will be the Focus on the selected issue */}
                {/* {issue.issue_type ? (
                  <IconButton
                    size="small"
                    aria-label={`Focus on task: ${issue?.name}`}
                  >
                    <LuScanEye />
                  </IconButton>
                ) : (
                  <IconButton size="small" aria-label="" aria-hidden="true">
                    <EmptyButtonDiv />
                  </IconButton>
                )} */}
                {/* This will be the expand/collapse button or the child arrow */}
                {issue.children ? (
                  <IconButton
                    size='small'
                    aria-label={`Show the Children of ${issue?.name}`}
                    onClick={() => handleToggleIssue(issue)}
                  >
                    <TbLayoutNavbarExpandFilled />
                  </IconButton>
                ) : (
                  <IconButton size='small' aria-label='' aria-hidden='true'>
                    <LuCornerDownRight />
                  </IconButton>
                )}
                <IssueNameDiv>{issue.name}</IssueNameDiv>
              </IssueContainer>
            </div>
          );
        })}
      </Box>
    </div>
  );
}
