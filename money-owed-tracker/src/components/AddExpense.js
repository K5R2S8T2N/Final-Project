import React from "react";
import SelectCurrency from "./addExpenseComponents/SelectCurrency";
import SelectAmount from "./addExpenseComponents/SelectAmount";
import SelectExpense from "./addExpenseComponents/SelectExpense";
import SelectMembersInvolved from "./addExpenseComponents/SelectMembersInvolved";
import ConfirmExpense from "./addExpenseComponents/ConfirmExpense";
import SelectPurchaseMadeBy from "./addExpenseComponents/SelectPurchaseMadeBy";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

class AddExpense extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
            groupName: localStorage.getItem('groupName'),
            groupCreator: localStorage.getItem("groupCreator"),
            groupMembers: localStorage.getItem("groupMembers"),
            allInputsFilled: false,
            everythingDisabled: false,
            expensesFilled: false,
            amountFilled: false,
            currencyFilled: false,
            involvedFilled: false,
            expense: null,
            amount: null,
            currency: null,
            involved: null,
            buyer: localStorage.getItem("signedin"),
            expenseHelperText: 'Required',
            expenseError: false,

        }
    }

    // for redirecting if not signed in 
    notRedirected = true;
    redirectNotSignedIn = () => {
        if(this.notRedirected){
            this.notRedirected = false;
            localStorage.setItem("redirectMessage", "Sign in to view add expenses page");
            window.location.href = '/';
        }
    }

    backToGroup = () => {
        window.location.href = '/opengroup';
    }

    changeExpenseError = (value) => {
        this.setState({expenseError: value});
    }

    changeExpenseHelperText = (status) => {
        this.setState({expenseHelperText: status});
    }

    changeEverythingDisabled = (status) => {
        this.setState({everythingDisabled: status})
    }

    // for checking if inputs are filled 
    changeExpenseStatus = (status) => {
        this.setState({expensesFilled: status});
    }
    changeAmountStatus = (status) => {
        this.setState({amountFilled: status});
    }
    changeCurrencyStatus = (status) => {
        this.setState({currencyFilled: status});
    }
    changeInvolvedStatus = (status) => {
        this.setState({involvedFilled: status});
    }

    // for saving value of input 
    changeExpense = (value) => {
        this.setState({expense: value});
    }
    changeAmount = (value) => {
        this.setState({amount: value});
    }
    changeCurrency = (value) => {
        this.setState({currency: value});
    }
    changeInvolved = (value) => {
        this.setState({involved: value});
    }
    changeBuyer = (value) => {
        this.setState({buyer: value});
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null && this.state.groupName != null) {
                return (
                    <div className="centerColumnContent">
                        <h3 className="creatingPagesTitle">Add Expense</h3>
                        <div className="centerColumnContent" id='addExpenseInputsDiv'>
                            <SelectExpense
                                inputDisabled={this.state.everythingDisabled}
                                inputFilled={this.changeExpenseStatus}
                                inputValue={this.changeExpense}
                                expenseMessage={this.state.expenseHelperText}
                                error={this.state.expenseError}
                                changeErrorStatus={this.changeExpenseError}
                                changeExpenseMessage={this.changeExpenseHelperText}

                            />
                            <div style={{display: 'flex'} }>
                                < SelectAmount inputDisabled={this.state.everythingDisabled} inputFilled={this.changeAmountStatus} inputValue={this.changeAmount}/>
                                < SelectCurrency inputDisabled={this.state.everythingDisabled} inputFilled={this.changeCurrencyStatus} inputValue={this.changeCurrency}/>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                < SelectMembersInvolved groupNamesArr={Object.values(JSON.parse(this.state.groupMembers))} inputDisabled={this.state.everythingDisabled} inputFilled={this.changeInvolvedStatus} inputValue={this.changeInvolved}/>
                                < SelectPurchaseMadeBy signedIn={this.state.signedIn} groupNamesArr={Object.values(JSON.parse(this.state.groupMembers))} inputDisabled={this.state.everythingDisabled} inputValue={this.changeBuyer}/>
                            </div>
                            <ConfirmExpense
                                allFilled={this.state.expensesFilled && this.state.amountFilled && this.state.currencyFilled && this.state.involvedFilled}
                                changeDisabled={this.changeEverythingDisabled}
                                expense={this.state.expense}
                                amount={this.state.amount}
                                currency={this.state.currency}
                                involved={this.state.involved}
                                buyer={this.state.buyer}
                                groupName={this.state.groupName}
                                groupCreator={this.state.groupCreator}
                                expenseMessage={this.changeExpenseHelperText}
                                expenseError={this.changeExpenseError}
                            />
                        </div>
                        <button onClick={this.backToGroup} disabled={this.state.everythingDisabled} className="navBarIcons" id='AddExpenseBackToGroupBtn'style={{marginBottom: '20px'}}>< ExitToAppOutlinedIcon style={{fontSize: '24px'}} className = 'importedLogos'/> Back To Group</button>
                    </div>
                );
            } else if (this.state.signedIn != null && this.state.groupName == null) {
                return (
                    <div>
                        <p>No group selected</p>
                    </div>
                    
                );
            } else {
                return (
                    <div>
                        {this.redirectNotSignedIn()}
                    </div>
                    
                );
            }
        }

        return(
            <div style={{minHeight: '800px'}}>
               {checkSignedIn()}
            </div>
        )
    }
}
export default AddExpense;