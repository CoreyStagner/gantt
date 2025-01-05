import React from 'react';
// import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import ControlPanel from './_ControlPanel';
import GridHeader from './_GridHeader';

// ... existing styled component code ...

interface GanttHeaderProps {
  timeRange: any; // Replace 'any' with actual timeRange type
  gridHeaderRef: React.RefObject<HTMLDivElement>;
  handleXScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

export default function GanttHeader({
  timeRange,
  gridHeaderRef,
  handleXScroll,
}: GanttHeaderProps) {
  if (!timeRange) return null;
  return (
    <div id='gantt_header'>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid size={3}>
            <ControlPanel />
          </Grid>
          <Grid size={9}>
            <GridHeader
              timeRange={timeRange}
              gridHeaderRef={gridHeaderRef}
              handleXScroll={handleXScroll}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
