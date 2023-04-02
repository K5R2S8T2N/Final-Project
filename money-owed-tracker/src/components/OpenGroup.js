import React from "react";
import MembersInvolvedDropdown from "./specificGroupComponents/MembersInvolvedDropdown";
import CurrencyDropdown from "./specificGroupComponents/CurrencyDropdown";
import PayedByDropdown from "./specificGroupComponents/PayedByDropdown";
import ExpensesDropdown from "./specificGroupComponents/ExpensesDropdown";
class OpenGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
            groupName: localStorage.getItem("groupName"),
        }
    }
    notRun = true;
    componentDidMount(){
        if(this.notRun){
            this.openGroup();
        }
        
    }

    openGroup =  () => {
        this.notRun = false;
        fetch('http://localhost:3000/loadSpecificGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.state.signedInId,
                groupName: localStorage.getItem("groupName"), 
                groupCreator: localStorage.getItem("groupCreator"),
                groupStatus: localStorage.getItem("groupStatus"),

            }),
        })
        .then((res) => {return res.json()})
        .then((responseJ) => {
            if (responseJ.status === 'pending'){
                window.location.href = '/openpending';
            } else {
                const groupMembersObj = {};
                responseJ.UsersArr.forEach((user, index) => {
                    groupMembersObj[index] = user;
                })
                localStorage.setItem("groupMembers", JSON.stringify(groupMembersObj));
                this.setState({groupMembers: responseJ.UsersArr});

                // for display settings 
                this.setState({payedByShown: responseJ.UsersArr});
                this.setState({loaneeShown: responseJ.UsersArr});
            }

            fetch('http://localhost:3000/loadSpecificExpensesForGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    signedIn: this.state.signedIn,
                    groupName: localStorage.getItem("groupName"), 
                    groupCreator: localStorage.getItem("groupCreator"),
                }),
            })
            .then((res) => {return res.json()})
            .then((otherResponseJ) => {
                console.log(otherResponseJ.overview);
                console.log(Object.entries(otherResponseJ.Expensesobj));
                this.setState({groupExpensesSummary: otherResponseJ.overview});
                this.setState({groupExpensesObjectArr: Object.entries(otherResponseJ.Expensesobj)});
                const currenciesArr = [];
                const expensesArr = [];
                Object.entries(otherResponseJ.Expensesobj).forEach((entry) => {
                    if(!currenciesArr.includes(entry[1].currency)){
                        currenciesArr.push(entry[1].currency);
                    }
                    expensesArr.push(entry[0]);
                });
                this.setState({currenciesListArr: currenciesArr});
                this.setState({expensesListArr: expensesArr});

                // for display settings 
                this.setState({expenseShown: expensesArr});
                this.setState({currencyShown: currenciesArr});
            })
        
        })

    }

    addExpense = () => {
        window.location.href = '/add';
    }

    updateExpenseDisplayed = (value) => {
        this.setState({expenseShown: value});
    }
    updatePayedByDisplayed = (value) => {
        this.setState({payedByShown: value});
    }
    updateCurrencyDisplayed = (value) => {
        this.setState({currencyShown: value});
    }
    updateLoaneeDisplayed = (value) => {
        this.setState({loaneeShown: value});
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null && this.state.groupName != null) {
                return (
                    <div>
                        <h3>Group: {this.state.groupName && this.state.groupName}</h3>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div>
                                <h3>groups members: </h3>
                                <ul>{this.state.groupMembers && this.state.groupMembers.map((member) => {
                                    return (<li key={member}>{member}</li>)
                                })
                                }</ul>
                            </div>
                            
                            <div>
                                <h3>Overview (not coded)</h3>
                                <table style={{border: "1px solid black"}}> 
                                    <tbody>
                                        <tr style={{border: "1px solid black"}}>
                                            <th style={{border: "1px solid black"}} rowSpan='2'>Member</th>
                                            <th style={{border: "1px solid black"}} colSpan="2">Current Balance</th>
                                        </tr>
                                        <tr style={{border: "1px solid black"}}>
                                            <th style={{border: "1px solid black"}}>Amount</th>
                                            <th style={{border: "1px solid black"}}>Currency</th>
                                        </tr>
                                        {
                                
                                            this.state.groupMembers && this.state.groupMembers.map((member) => {
                                                return(
                                                    <React.Fragment key={member}>
                                                    {
                                                        this.state.currenciesListArr && this.state.currenciesListArr.map((currency, index, arr) => {
                                                            if(index == 0){
                                                                return( 
                                                                    <tr style={{border: "1px solid black"}} key={`${currency}-${index}`}>
                                                                        <td style={{border: "1px solid black"}} rowSpan={arr.length}>{member}</td>
                                                                        <td style={{border: "1px solid black"}}>not coded</td>
                                                                        <td style={{border: "1px solid black"}}>{this.state.currenciesListArr[index]}</td>
                                                                    </tr>
                                                                )
                                                            } else {
                                                                return (
                                                                    <tr style={{border: "1px solid black"}} key={`${currency}-${index}`}>
                                                                        <td style={{border: "1px solid black"}}>not coded</td>
                                                                        <td style={{border: "1px solid black"}}>{this.state.currenciesListArr[index]}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            
                            <div>
                                <h3>List of Expenses</h3>
                                <div style={{display: 'flex', flexDirection: 'column',  width: '800px'}}>
                                    <h4>Filters</h4>
                                    { this.state.expensesListArr? < ExpensesDropdown ExpensesArr={this.state.expensesListArr} updateExpenseDisplayed={this.updateExpenseDisplayed}/> : ''}
                                    { this.state.groupMembers? < PayedByDropdown groupNamesArr={this.state.groupMembers} updatePayedByDisplayed={this.updatePayedByDisplayed}/> : ''}
                                    { this.state.currenciesListArr? < CurrencyDropdown currenciesArr={this.state.currenciesListArr} updateCurrencyDisplayed={this.updateCurrencyDisplayed}/> : ''}
                                    { this.state.groupMembers? < MembersInvolvedDropdown groupNamesArr={this.state.groupMembers} updateLoaneeDisplayed={this.updateLoaneeDisplayed}/> : ''}
                                </div>
                                <div>
                                    <h4>Expenses</h4>
                                    <table style={{border: "1px solid black", marginBottom: '20px',  width: '800px'}}> 
                                        <tbody>
                                            <tr style={{border: "1px solid black"}}>
                                                <th style={{border: "1px solid black", padding: '3px'}} >Expense</th>
                                                <th style={{border: "1px solid black", padding: '3px'}}>Payed by</th>
                                                <th style={{border: "1px solid black", padding: '3px'}}>Amount</th>
                                                <th style={{border: "1px solid black", padding: '3px'}}>Currency</th>
                                                <th style={{border: "1px solid black", padding: '3px'}}>Loanees</th>
                                            </tr>
                                            {
                                                this.state.groupExpensesObjectArr && this.state.groupExpensesObjectArr.map((expense) => {
                                                    let loaneeInIncluded = false;
                                                    if(this.state.expenseShown.includes(expense[0]) && this.state.payedByShown.includes(expense[1].buyer) && this.state.currencyShown.includes(expense[1].currency)){
                                                        expense[1].involved.map((member) => {
                                                            if (this.state.loaneeShown.includes(member)){
                                                                if(!expense[1].buyerInvolved && member !== expense[1].buyer){
                                                                    loaneeInIncluded = true;
                                                                } else if (expense[1].buyerInvolved){
                                                                    loaneeInIncluded = true;
                                                                }
                                                            }
                                                        })
                                                        if(loaneeInIncluded){
                                                            return (
                                                                <tr style={{border: "1px solid black"}} key={expense[0]}>
                                                                    <td style={{border: "1px solid black", padding: '3px'}}>{expense[0]}</td> 
                                                                    <td style={{border: "1px solid black", padding: '3px'}}>{expense[1].buyer}</td>
                                                                    <td style={{border: "1px solid black", padding: '3px'}}>{expense[1].amount}</td>
                                                                    <td style={{border: "1px solid black", padding: '3px'}}>{expense[1].currency}</td>
                                                                    <td style={{border: "1px solid black", padding: '3px'}}>{expense[1].involved.map((member, index, arr) => {
                                                                        return(`${!expense[1].buyerInvolved && expense[1].buyer === member?
                                                                            '' :
                                                                            `${!expense[1].buyerInvolved?
                                                                                `${index == arr.length-2 && arr.length > 2?
                                                                                    `and ${member}` :
                                                                                    `${arr.length == 2?
                                                                                        `${member}` :
                                                                                        `${index == arr.length-3 ?
                                                                                            `${member} ` :
                                                                                            `${member}, `}`}`}` :
                                                                            `${index == arr.length-1 && arr.length > 1?
                                                                                `and ${member}` :
                                                                                `${arr.length == 1?
                                                                                    `${member}` :
                                                                                    `${index == arr.length-2 ?
                                                                                        `${member} ` :
                                                                                        `${member}, `
                                                                                        }`
                                                                                    }`
                                                                                }`
                                                                            }`
                                                                        }`) 
                                                                    })}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    }
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button onClick={this.addExpense}> add expense</button>
                        </div>
                    </div>
                );
            } else if (this.state.signedIn != null && this.state.groupName == null){
                return (
                    <div>
                        <p>No Group Selected</p>
                    </div>
                    
                );
            } else {
                return (
                    <div>
                        <p>Sign in to view groups</p>
                    </div>
                    
                );
            }
        }

        return(
            <div>
               {checkSignedIn()}
            </div>
        )
    }
}
export default OpenGroup;