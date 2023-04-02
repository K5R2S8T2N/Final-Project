import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';

export default function SelectPurchaseMadeBy(props) {
    const names = props.groupNamesArr; 
    const signedIn = props.signedIn;

    const saveInput = (e) => {
      props.inputValue(e.target.value);
    }

  return (
    <FormControl
          required
          component="fieldset"
          sx={{ m: 3 }}
          variant="standard"
          disabled = {props.inputDisabled}
      >

      <FormLabel id="demo-radio-buttons-group-label">Purchase made by</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={signedIn}
        name="radio-buttons-group"
        onClick={saveInput}
      >
        {
            names.map((user) => {
                return (
                    <FormControlLabel value={user} control={<Radio />} label={user} key={user}/>
                )
            })
        }
        <FormHelperText>Required</FormHelperText>
      </RadioGroup>
    </FormControl>
  );
}