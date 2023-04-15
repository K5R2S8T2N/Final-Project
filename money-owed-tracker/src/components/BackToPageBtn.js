import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function BackToPageBtn(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const cancel = () => {
    setOpen(false);
  };

  const redirect = () => {
    setOpen(false);
    window.location.href = props.location;
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} id='backtoPreviousPageBtn'>
        <ArrowBackIosNewIcon sx={{mr: '8px', fontSize: 'medium'}} className = 'importedLogos'/>{props.message}
      </Button>
      <Dialog
        open={open}
        onClose={cancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            Exit to {props.pageRedirectedTo}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Any unsaved changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel}>Cancel</Button>
          <Button onClick={redirect} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}