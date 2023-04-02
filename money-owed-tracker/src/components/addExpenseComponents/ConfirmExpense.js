import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmExpense(props) {
  const [open, setOpen] = React.useState(false);
  const allFilled = props.allFilled;

  const saveExpense = (e) => {

    // add to db
    fetch('http://localhost:3000/addToExpenseTable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupName: props.groupName,
        creator: localStorage.getItem("groupCreator"),
        expense: props.expense,
        amount: props.amount,
        currency: props.currency,
        buyer: props.buyer,
        involvedArr: props.involved,
      }),
    })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      window.location.href = '/openGroup';
    })
    .catch((err) => console.log(err))
  }

  return (
    <div>
    <Box sx={{ width: '700px'}}>

      <Collapse in={open}>
        <Alert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="medium"
              onClick={() => {
                setOpen(false);
                const saveBtn = document.getElementById('test');
                if(allFilled){
                  saveBtn.classList.remove('Mui-disabled');
                  saveBtn.disabled = false;
                }
                props.changeDisabled(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mt: 2, display:'flex', alignItems:'center', justifyContent: 'center'}}

          color="primary"
        >
          <p style={{wordWrap: 'break-word'}}> Expense <b>{props.expense}</b> worth <b>{props.amount}</b> <b>{props.currency}{props.amount>1 ? 's' : ''}</b> purchased by <b>{props.buyer}</b> involving <b>{props.involved && props.involved.map((member, index, arr) => {return `${index == arr.length-1 && arr.length > 1? `and ${member},` : `${member}, `}`})}</b> will be added to group expenses. </p>

          <Button
            variant="contained"
            disableElevation
            color ="primary"
            size="small"
            onClick={saveExpense}
            sx={{ ml: 2 }}>
            OK
          </Button>

        </Alert>
      </Collapse>

      <Button
        disabled={!allFilled}
        variant="outlined"
        // style = {{background:"blue"}}
        id='test'
        onClick={(e) => {

          // check expense name not already taken for group
          fetch('http://localhost:3000/checkExpenseName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupName: props.groupName,
                    expenseName: props.expense,
                    groupCreator: props.groupCreator,
                }),
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if(data.status === 'available' && props.expense.length <= 200){
                  setOpen(true);
                  e.target.disabled = true;
                  e.target.classList.add('Mui-disabled')
                  props.changeDisabled(true);
                } else {
                  props.expenseError(true);
                  if(data.status === 'unavailable'){
                    props.expenseMessage(data.message);
                  }
                  if(props.expense.length > 200){
                    props.expenseMessage('Expense cannot exceed 200 characters');
                  }
                }
            })


        }}
        sx={{ mt: 3, mb: 3 }}
      >
        Save
      </Button>
    </Box>
    <p id='nameTakenMessage'></p>
    </div>
  );
}