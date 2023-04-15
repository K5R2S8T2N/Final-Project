import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintableSummary from './PrintableSummary';

export default function ExpensesDropdown(props) {
  const [expanded, setExpanded] = React.useState(false);
  const groupMembers = props.groupMembers;
  const currenciesListArr = props.currenciesListArr;
  const groupExpensesSummary = props.groupExpensesSummary;

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{display: 'flex', alignItems: 'center', background: 'rgb(196, 196, 196)', border: '3px solid rgb(167, 167, 167)'}}
        >
          <p className='printableSummaryDropdownTitle'> Summary of Members' Balances </p>
        </AccordionSummary>
        <AccordionDetails>
            < PrintableSummary groupMembers={groupMembers} currenciesListArr = {currenciesListArr} groupExpensesSummary={groupExpensesSummary} changePopup={props.changePopup}/> 
        </AccordionDetails>
      </Accordion>
    </div>
  );
}