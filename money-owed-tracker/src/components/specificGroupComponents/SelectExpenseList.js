import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';

export default function SelectExpenseList(props) {
    const expenses = props.ExpensesArr;
    let statesArr = [];
    const childrenState = {};
    const [state, setState] = React.useState(childrenState);
    const [checked, setChecked] = React.useState(statesArr);
    const [allChecked, setAllChecked] = React.useState(true);
    const [someChecked, setSomeChecked] = React.useState(false);

    expenses.forEach((expense) => {
      statesArr.push(true);
      childrenState[expense] = true;
    });

    const error = checked.filter((v) => v).length === 0;



    const handleChangeChildren = (event) => {
      setState({
        ...state,
        [event.target.name]: event.target.checked,
      });
      
      const index = expenses.indexOf(event.target.name);
      const newStatesArr = checked;
      newStatesArr.splice(index, 1, event.target.checked);
      setChecked(newStatesArr);

      let all = true;
      for (let i=1; i<newStatesArr.length; i++){
        if (newStatesArr[i] !== newStatesArr[i-1]){
          setAllChecked(false);
          setSomeChecked(true);
          all = false;
          
          const submittedExpensesArr = [];
          for (let a=0; a<newStatesArr.length; a++){
            if (newStatesArr[a] === true){
              submittedExpensesArr.push(expenses[a])
            }
          }
          if(submittedExpensesArr.length === 0){
            props.inputValue('none', submittedExpensesArr);
          }else{
            let sentence = '';
            submittedExpensesArr.forEach((expense, index, arr) => {
              if(index === arr.length -1){
                if(arr.length === 1){
                  sentence = `${sentence}${expense}`;
                } else {
                  sentence = `${sentence}and ${expense}`;
                }
                
              } else if(index === (arr.length - 2)){
                sentence = `${sentence}${expense} `;
              } else {
                sentence = `${sentence}${expense}, `;
              }
            })
            props.inputValue(sentence, submittedExpensesArr);
          }
        }
      }

      if(all){
        setSomeChecked(false);
          if(checked[0] === true){
            setAllChecked(true);
            props.inputValue('all', expenses);

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
          props.inputValue('all', expenses);
        } else {
          props.inputValue('none', []);
        }

        const newChildrenState = {};
        expenses.forEach((expense) => {
          newChildrenState[expense] = event.target.checked;
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
          <FormLabel component="legend">Displayed expenses</FormLabel>
            <FormControlLabel
                label="All Expenses"
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
                expenses.map((expense) => {
                  return (
                    <FormControlLabel
                      label = {expense}
                      control={<Checkbox checked={state[expense]} onChange={handleChangeChildren} name={expense} />}
                      key = {expense}
                    />
                  )
                })
              }
            </FormGroup>
        </FormControl>
      </Box>
    );
  }