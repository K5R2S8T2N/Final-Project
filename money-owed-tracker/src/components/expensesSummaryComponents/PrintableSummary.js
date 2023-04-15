import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import  ExpensesSummary from './ExpensesSummary';

 const PrintableSummary = React.forwardRef((props, ref) => {
    const groupMembers = props.groupMembers;
    const currenciesListArr = props.currenciesListArr;
    const groupExpensesSummary = props.groupExpensesSummary;

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '80px', paddingRight: '40px'}}>
                <h2 className='openGroupTitle'>Summary Page</h2>
                <button onClick={handlePrint} id='printBtn'>Print</button>
            </div>
            
            <div id='summaryPageToPrint'>
                < ExpensesSummary groupMembers={groupMembers} currenciesListArr = {currenciesListArr} groupExpensesSummary={groupExpensesSummary} changePopup={props.changePopup} ref={componentRef}/>
            </div>
        </div>
    );
})

export default PrintableSummary