import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function BackToHomePage() {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ width: '650px' }}>
      <Collapse in={open}>
        <Alert
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, display:'flex', alignItems:'center'}}

          color="primary"
        >
          Are You Sure You want to exit? Any unsaved changes will be lost.
          <Button
          variant="contained"
          disableElevation
          color ="primary"
          size="small"
          sx={{ ml: '50px'}}
          onClick={() => {
            window.location.href = '/';
          }}>
            Yes
          </Button>
        </Alert>
      </Collapse>
      <Button
        disabled={open}
        variant="outlined"
        // style = {{background:"blue"}}
        onClick={() => {
          setOpen(true);
        }}
      >
        <ArrowBackIosNewIcon sx={{mr: '8px', fontSize: 'medium'}}/> Back To Home Page
      </Button>
    </Box>
  );
}