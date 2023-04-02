import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';

export default function SelectMembersInvolved(props) {
    const names = props.groupNamesArr;
    let statesArr = [];
    const childrenState = {};
    
    names.forEach((name) => {
        statesArr.push(false);
        childrenState[name] = false;
    })

    const [state, setState] = React.useState(childrenState);
    const [checked, setChecked] = React.useState(statesArr);
    const [allChecked, setAllChecked] = React.useState(false);
    const [someChecked, setSomeChecked] = React.useState(false);

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
          props.inputValue(submittedNamesArr);
          props.inputFilled(true);
        }
      }
      if(all){
        setSomeChecked(false);
          if(checked[0] === true){
            setAllChecked(true);
            props.inputValue(names);
            props.inputFilled(true);

          } else {
            setAllChecked(false);
            props.inputFilled(false);
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
          props.inputValue(names);
        }
        props.inputFilled(event.target.checked);

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
          disabled = {props.inputDisabled}
        >
          <FormLabel component="legend">Members involved</FormLabel>
            <FormControlLabel
                label="All Members"
                disabled = {props.inputDisabled}
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
                      disabled = {props.inputDisabled}
                    />
                  )
                })
              }
              <FormHelperText>Required</FormHelperText>
            </FormGroup>
        </FormControl>
      </Box>
    );
  }