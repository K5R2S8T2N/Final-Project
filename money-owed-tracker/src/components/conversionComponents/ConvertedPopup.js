import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConvertedPopup(props) {
  const open = props.isOpen;
  const changeOpen = props.changeOpen;
  const dataDisplayed = Object.entries(props.dataToDisplay.data);

  const handleClose = () => {
    changeOpen(false);
  };

  let total = 0;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className='convertedPopupTitle'>
          {`Amount owed converted to ${props.base.split('#').join(' ')}s`}
        </DialogTitle>
        <DialogContent>
            <table id='convertedCurrenciesTable'>
                <thead id='convertedCurrenciesTableHead'>
                    <tr>
                        <th>Currency</th>
                        <th>Exchange Rate</th>
                        <th>{`Amount owed in ${props.base.split('#').join(' ')}s`}</th>
                    </tr>
                </thead>
                <tbody id='convertedCurrenciesTableBody'>
                { 
                    dataDisplayed.map((currency) => {
                        let curName;
                        let amount;
                        return (
                            <React.Fragment key={`${currency[0]}-${currency[1]}`}>
                            {
                                props.original.map((currencyBalance, index, arr) => {
                                    if (currencyBalance[0][1] === currency[0]){
                                        curName = currencyBalance[0][2].split('#').join(' ');
                                        amount = currencyBalance[0][0] * (1 / currency[1]) * -1;
                                        total = total + amount;
                                    }
                                    if (index === arr.length - 1){
                                        return (
                                           <tr key={`${currency[0]}-${currency[1]}`}>
                                               <td className = 'convertedCurrenciesTableInput'>{curName}</td>
                                               <td className = 'convertedCurrenciesTableInput'>{currency[1]}</td>
                                               <td className = 'convertedCurrenciesTableInput'>{amount}</td>
                                           </tr>
                                        )
                                    }
                                    return(<React.Fragment key={`unfinished-${index}-${currency[0]}-${currency[1]}`}></React.Fragment>)
                               })
                            }
                            </React.Fragment>
                        )
                    })
                }
                </tbody>
            </table>
            <h4 id='totalConversionAmountTitle'>{`Total Amount Owed in ${props.base.split('#').join(' ')}s:`}</h4>
            <p id='totalConversionAmount'>{total}</p>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}