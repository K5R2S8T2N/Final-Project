import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';

export default function SelectCurrenciesList(props) {
    const currencies = props.currenciesArr;
    let statesArr = [];
    const childrenState = {};
    const [state, setState] = React.useState(childrenState);
    const [checked, setChecked] = React.useState(statesArr);
    const [allChecked, setAllChecked] = React.useState(true);
    const [someChecked, setSomeChecked] = React.useState(false);

    currencies.forEach((currency) => {
      statesArr.push(true);
      childrenState[currency] = true;
    });

    const error = checked.filter((v) => v).length === 0;



    const handleChangeChildren = (event) => {
      setState({
        ...state,
        [event.target.name]: event.target.checked,
      });
      
      const index = currencies.indexOf(event.target.name);
      const newStatesArr = checked;
      newStatesArr.splice(index, 1, event.target.checked);
      setChecked(newStatesArr);

      let all = true;
      for (let i=1; i<newStatesArr.length; i++){
        if (newStatesArr[i] !== newStatesArr[i-1]){
          setAllChecked(false);
          setSomeChecked(true);
          all = false;
          
          const submittedCurrenciesArr = [];
          for (let a=0; a<newStatesArr.length; a++){
            if (newStatesArr[a] == true){
                submittedCurrenciesArr.push(currencies[a])
            }
          }
          if(submittedCurrenciesArr.length == 0){
            props.inputValue('none', []);
          }else{
            let sentence = '';
            submittedCurrenciesArr.forEach((currency, index, arr) => {
              if(index == arr.length -1){
                if(arr.length == 1){
                  sentence = `${sentence}${currency}`;
                } else {
                  sentence = `${sentence}and ${currency}`;
                }
                
              } else if(index == (arr.length - 2)){
                sentence = `${sentence}${currency} `;
              } else {
                sentence = `${sentence}${currency}, `;
              }
            })
            props.inputValue(sentence, submittedCurrenciesArr);
          }
        }
      }

      if(all){
        setSomeChecked(false);
          if(checked[0] === true){
            setAllChecked(true);
            props.inputValue('all', currencies);

          } else {
            setAllChecked(false);
            props.inputValue('none', []);
          }
      }
    }


    const handleChangeParent = (event) => {
        const newStatesArr = [];
        statesArr.forEach((user) => {
            newStatesArr.push(event.target.checked);
        })
        setChecked(newStatesArr);
        setAllChecked(event.target.checked);
        setSomeChecked(false);
        if (event.target.checked){
          props.inputValue('all', currencies);
        } else {
          props.inputValue('none', []);
        }

        const newChildrenState = {};
        currencies.forEach((currency) => {
          newChildrenState[currency] = event.target.checked;
        })
        setState(newChildrenState);
    };
  
    
    return (
      <Box
        sx={{ display: 'flex' }}
      >
        <FormControl
          required
          error={error}
          component="fieldset"
          sx={{ m: 3 }}
          variant="standard"
        >
          <FormLabel component="legend">Displayed currencies</FormLabel>
            <FormControlLabel
                label="All Currencies"
                control={
                <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={handleChangeParent}
                />
                }
            />

            <FormGroup
              sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}
            >
              {
                currencies.map((currency) => {
                  return (
                    <FormControlLabel
                      label = {currency}
                      control={<Checkbox checked={state[currency]} onChange={handleChangeChildren} name={currency} />}
                      key = {currency}
                    />
                  )
                })
              }
            </FormGroup>
        </FormControl>
      </Box>
    );
  }