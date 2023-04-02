import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Currencies from './Currencies.json'


export default function SelectCurrency(props) {
  const [currency, setCurrency] = React.useState('');
  const currenciesList = Currencies;

  const handleChange = (event) => {
    setCurrency(event.target.value);
    if(event.target.value !== ''){
      props.inputValue(event.target.value);
      props.inputFilled(true);
    } else {
      props.inputFilled(false);
    }
  };

  return (
    <div>
      <FormControl
        required sx={{ m: 1, minWidth: 120 }}
        disabled = {props.inputDisabled}
      >
        <InputLabel id="demo-simple-select-required-label">Currency</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={currency}
          label="Currency *"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
            currenciesList && currenciesList.map((currency) => {
                return (
                    <MenuItem value={currency.name} key={currency.code}>
                    <em>{currency.name}</em>
                  </MenuItem>
                )
            })
          }
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>
    </div>
  );
}