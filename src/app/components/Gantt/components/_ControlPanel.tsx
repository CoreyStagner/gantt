import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';
import { BiHorizontalCenter } from 'react-icons/bi';

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// interface IssueFormData {
//   name: string;
//   assignedTo: string;
//   startDate: string;
//   endDate: string;
//   summary: string;
//   issueType: string;
//   description: string;
//   iteration: string;
// }

export default function ControlPanel(): React.ReactNode {
  const [open, setOpen] = useState<boolean>(false);
  // const [formData, setFormData] = useState<IssueFormData>({
  //   name: '',
  //   assignedTo: '',
  //   startDate: '',
  //   endDate: '',
  //   summary: '',
  //   issueType: '',
  //   description: '',
  //   iteration: '',
  // });

  const handleClose = (): void => setOpen(false);
  const handleOpen = (): void => setOpen(true);
  return (
    <div id='gantt'>
      {/* Create custom component for this. */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <Box sx={modalStyle}>
          <Typography id='modal-title' variant='h6' component='h2'>
            Create New Issue
          </Typography>
          <Typography id='modal-description' sx={{ mt: 2 }}>
            Fill in the fields below to create a new issue.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <div>
              Issue Name:
              <input />
            </div>
            <div>
              Assigned To:
              <input />
            </div>
            <div>
              Start Date:
              <input />
            </div>
            <div>
              End Date:
              <input />
            </div>
            <div>
              Summary:
              <input />
            </div>
            <div>
              Issue Type:
              <input />
            </div>
            <div>
              Description:
              <input />
            </div>
            <div>
              Iteration:
              <input />
            </div>
          </Box>
          <Button variant='contained' size='large' onClick={handleClose}>
            Create Issue
          </Button>
        </Box>
      </Modal>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid
            size={10}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button variant='contained' size='large' onClick={handleOpen}>
              Create New Issue
            </Button>
          </Grid>
          <Grid size={2}>
            <Item>
              <IconButton size='small' aria-label='Zoom In'>
                <CiCirclePlus />
              </IconButton>
              <IconButton
                size='small'
                aria-label='Focus around the current issue'
              >
                <BiHorizontalCenter />
              </IconButton>
              <IconButton size='small' aria-label='Zoom Out'>
                <CiCircleMinus />
              </IconButton>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
