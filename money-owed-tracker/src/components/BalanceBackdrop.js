import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';

export default function BalanceBackdrop(props) {
  const handleClose = () => {
    props.changePopup(false);
  };

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.balancePopupStatus}
        onClick={handleClose}
      >
        <Box
        sx={{
            width: 300,
            height: 180,
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '30px',
            lineHeight: '30px',
            borderRadius: '25px',
            '&:hover': {
            backgroundColor: 'black',
            color: 'grey',
            opacity: [0.9, 0.8, 0.7],
            },
        }}
        >
            Balance represents how much money the individual owes. Negative balances implies the individual owes money, while a positive balance implies the individual is owed money.
        </Box >
      </Backdrop>
    </div>
  );
}