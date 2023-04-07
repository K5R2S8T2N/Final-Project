import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

export default function SelectExpense(props) {

  // stop enter key triggering submit 
  const prevent = (e) => {
    props.changeErrorStatus(false);
    props.changeExpenseMessage('Required');
    if(e.key === 'Enter'){
        e.preventDefault();
    }
  }

  const checkFilled = (e) => {
    // stop spaces 
    if(e.keyCode == 32){
      e.target.value = e.target.value.split(' ').join('');
    }

    // stop '-' character 
    if(e.key ==='-'){
        e.target.value = e.target.value.split('-').join('');
    }

    const inputValue = e.target.value.trim();

    if(inputValue !== ''){
      props.inputValue(inputValue);
      props.inputFilled(true);
    } else {
      props.inputFilled(false);
    }
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '388px' },
      }}
      noValidate
      autoComplete="off"
    >
    <TextField
        id="outlined-multiline-flexible"
        label="Expense *"
        multiline
        maxRows={4}
        disabled={props.inputDisabled}
        onKeyDown={prevent}
        onKeyUp={checkFilled}
        error={props.error}
    />
    <FormHelperText
      sx={{ ml: 3, mt: -0.65}}
      error={props.error}
      >{props.expenseMessage}</FormHelperText>
    </Box>
  );
}