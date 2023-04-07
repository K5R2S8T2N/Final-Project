import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

export default function SelectAmount(props) {
  // stop enter key triggering submit 
  const [correctInput, setCorrectInput] = React.useState(null);
  const [shrinkLabel, setShrinkLabel] = React.useState(false);

  const prevent = (e) => {
    setCorrectInput(e.target.value);
    if(e.key === 'Enter'){
        e.preventDefault();
    }
  }

  const removeUnwantedCharacters = (e) => {
    if(e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E'){
      e.target.value=correctInput;
    }
    if(e.target.value < 0){
      e.target.value = 0;
    }
  }

  const stopNegativeScroll = (e) => {
    if(e.target.value < 0){
      e.target.value = 0;
    }
    if(e.target.value > 0){
      props.inputValue(e.target.value);
      props.inputFilled(true);
      

    } else {
      props.inputFilled(false);
    }
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch'},
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-number"
        label="Amount *"
        type="number"
        InputLabelProps={{
          shrink: shrinkLabel,
        }}
        disabled = {props.inputDisabled}
        onKeyDown = {prevent}
        onKeyUp = {removeUnwantedCharacters}
        onChange = {stopNegativeScroll}
        onClick = {() => {
          setShrinkLabel(true)
        }}
        onBlur = { (e) => {
          if(e.target.value === ''){
            setShrinkLabel(false)
          }
        }}
      />
      <FormHelperText 
      sx={{ ml: 3, mt: -0.65}}
      >Required</FormHelperText>
    </Box>
    
  );
}