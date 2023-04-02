import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';

export default function SelectLoanees(props) {
    const names = props.groupNamesArr;
    let statesArr = [];
    const childrenState = {};
    const [state, setState] = React.useState(childrenState);
    const [checked, setChecked] = React.useState(statesArr);
    const [allChecked, setAllChecked] = React.useState(true);
    const [someChecked, setSomeChecked] = React.useState(false);

    names.forEach((name) => {
      statesArr.push(true);
      childrenState[name] = true;
    });

    const error = checked.filter((v) => v).length === 0;



    const handleChangeChildren = (event) => {
      setState({
        ...state,
        [event.target.name]: event.target.checked,
      });
      
      const index = names.indexOf(event.target.name);
      const newStatesArr = checked;
      newStatesArr.splice(index, 1, event.target.checked);
      setChecked(newStatesArr);

      let all = true;
      for (let i=1; i<newStatesArr.length; i++){
        if (newStatesArr[i] !== newStatesArr[i-1]){
          setAllChecked(false);
          setSomeChecked(true);
          all = false;
          
          const submittedNamesArr = [];
          for (let a=0; a<newStatesArr.length; a++){
            if (newStatesArr[a] == true){
              submittedNamesArr.push(names[a])
            }
          }
          if(submittedNamesArr.length == 0){
            props.inputValue('none', []);
          }else{
            let sentence = '';
            submittedNamesArr.forEach((name, index, arr) => {
              if(index == arr.length -1){
                if(arr.length == 1){
                  sentence = `${sentence}${name}`;
                } else {
                  sentence = `${sentence}and ${name}`;
                }
                
              } else if(index == (arr.length - 2)){
                sentence = `${sentence}${name} `;
              } else {
                sentence = `${sentence}${name}, `;
              }
            })
            props.inputValue(sentence, submittedNamesArr);
          }
        }
      }

      if(all){
        setSomeChecked(false);
          if(checked[0] === true){
            setAllChecked(true);
            props.inputValue('all', names);

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
          props.inputValue('all', names);
        } else {
          props.inputValue('none', []);
        }

        const newChildrenState = {};
        names.forEach((name) => {
          newChildrenState[name] = event.target.checked;
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
          <FormLabel component="legend">Displayed expenses which include loanees</FormLabel>
            <FormControlLabel
                label="All Members"
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
                names.map((person) => {
                  return (
                    <FormControlLabel
                      label = {person}
                      control={<Checkbox checked={state[person]} onChange={handleChangeChildren} name={person} />}
                      key = {person}
                    />
                  )
                })
              }
            </FormGroup>
        </FormControl>
      </Box>
    );
  }