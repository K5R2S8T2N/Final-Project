import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SelectLoanees from './SelectLoanees';

export default function MembersInvolvedDropdown(props) {
  const [expanded, setExpanded] = React.useState(false);
  const [displayValue, setDisplayValue] = React.useState('all');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changeSetAs = (value, arr) => {
    setDisplayValue(value);
    props.updateLoaneeDisplayed(arr);
  }

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{flexShrink: 0, mr: 2}}>
            Loanees
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Displaying: {displayValue}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SelectLoanees groupNamesArr={props.groupNamesArr} inputValue={changeSetAs}/>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}