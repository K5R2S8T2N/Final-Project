import React from "react";
import MembersInvolvedDropdown from "./specificGroupComponents/MembersInvolvedDropdown";
import CurrencyDropdown from "./specificGroupComponents/CurrencyDropdown";
import PayedByDropdown from "./specificGroupComponents/PayedByDropdown";
import ExpensesDropdown from "./specificGroupComponents/ExpensesDropdown";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import BalanceBackdrop from "./BalanceBackdrop";

class OpenGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
            groupName: localStorage.getItem("groupName"),
            balancePopupStatus: false,
        }
    }
    notRun = true;
    componentDidMount(){
        if(this.notRun){
            this.openGroup();
        }
        
    }

    // for redirecting if not signed in 
    notRedirected = true;
    redirectNotSignedIn = () => {
        if(this.notRedirected){
            this.notRedirected = false;
            localStorage.setItem("redirectMessage", "Sign in to view groups");
            window.location.href = '/';
        }
    }

    // for redirecting if no group selected 
    notGroupRedirected = true;
    redirectNoGroupSelected = () => {
        if(this.notGroupRedirected){
            this.notGroupRedirected = false;
            localStorage.setItem("redirectMessage", "No Group Selected");
            window.location.href = '/groups';
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
                this.setState({groupExpensesSummary: otherResponseJ.overview});
                this.setState({groupExpensesObjectArr: Object.entries(otherResponseJ.Expensesobj)});
                console.log(otherResponseJ.overview);
                console.log(Object.entries(otherResponseJ.Expensesobj));
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

    addExpense = (e) => {
        e.stopPropagation();
        window.location.href = '/add';
    }

    partialDeleteExpense = (e) => {
        e.stopPropagation();
        const confirmBtn = document.querySelector(`.confirm-btn-elements-${e.target.id}`);
        const cancelBtn = document.querySelector(`.cancel-btn-elements-${e.target.id}`);
        const deleteBtn = document.querySelector(`.delete-btn-elements-${e.target.id}`);
        deleteBtn.style.display = 'none';
        confirmBtn.style.removeProperty('display');
        cancelBtn.style.removeProperty('display');
    }

    cancelDelete = (e) => {
        e.stopPropagation();
        const idArr = e.target.id.split('-');
        const confirmBtn = document.querySelector(`.confirm-btn-elements-${idArr[1]}`);
        const cancelBtn = document.querySelector(`.cancel-btn-elements-${idArr[1]}`);
        const deleteBtn = document.querySelector(`.delete-btn-elements-${idArr[1]}`);
        cancelBtn.style.display = 'none';
        confirmBtn.style.display = 'none';
        deleteBtn.style.removeProperty('display');
    }

    deleteExpense = (e) => {
        e.stopPropagation();
        const idArr = e.target.id.split('-');

        fetch('http://localhost:3000/deleteExpense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupName: localStorage.getItem("groupName"), 
                    expenseName: idArr[1],
                }),
            })
            .then((res) => {return res.json()})
            .then((data) => {
                const deletedExpenseName = data.deletedExpenseArr[0].expense;

                // update all tables / filters 
                const newGroupExpensesSummary = this.state.groupExpensesSummary.filter((el) => el.expense !== deletedExpenseName);
                this.setState({groupExpensesSummary: newGroupExpensesSummary});

                const newGroupExpensesObjectArr = this.state.groupExpensesObjectArr.filter((el) => el[0] !== deletedExpenseName);
                this.setState({groupExpensesObjectArr: newGroupExpensesObjectArr}, () => {
                    const currenciesArr = [];
                    this.state.groupExpensesObjectArr.forEach((entry) => {
                        if(!currenciesArr.includes(entry[1].currency)){
                            currenciesArr.push(entry[1].currency);
                        }
                    });
                    this.setState({currenciesListArr: currenciesArr}, () => {                        
                        const newCurrencyShown = this.state.currencyShown.filter((el) => this.state.currenciesListArr.includes(el));
                        this.setState({currencyShown: newCurrencyShown});
                    });
                });

                const newExpensesListArr = this.state.expensesListArr.filter((el) => el !== deletedExpenseName);
                this.setState({expensesListArr: newExpensesListArr});

                const newExpenseShown = this.state.expenseShown.filter((el) => el !== deletedExpenseName);
                this.setState({expenseShown: newExpenseShown});                
            })

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

    // for explaining balance popup 
    changePopup = (stat) => {
        this.setState({balancePopupStatus: stat});
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null && this.state.groupName != null) {
                return (
                    <div>
                        <h3>Group: {this.state.groupName && this.state.groupName}</h3>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div>
                                <h3>Groups Members: </h3>
                                <ul>{this.state.groupMembers && this.state.groupMembers.map((member) => {
                                    return (<li key={member}>{member}</li>)
                                })
                                }</ul>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
                                <div style={{marginRight: '30px'}}>
                                    <h3>Overview</h3>
                                    <table style={{border: "1px solid black"}}> 
                                        <tbody>
                                            <tr style={{border: "1px solid black"}}>
                                                <th style={{border: "1px solid black"}} rowSpan='2'>Member</th>
                                                <th style={{border: "1px solid black"}} colSpan="2">Current Balance</th>
                                            </tr>
                                            <tr style={{border: "1px solid black"}}>
                                                <th style={{border: "1px solid black"}}>Balance <HelpOutlineRoundedIcon style={{fontSize: '20px'}} onClick={() => {this.setState({balancePopupStatus: true})}}/></th>
                                                <th style={{border: "1px solid black"}}>Currency</th>
                                            </tr>
                                            {
                                    
                                                this.state.groupMembers && this.state.groupMembers.map((member) => {
                                                    return(
                                                        <React.Fragment key={`groupMembers:${member}`}>
                                                        {
                                                            this.state.currenciesListArr && this.state.currenciesListArr.map((currency, index, arr) => {
                                                                let amountPerCurrency = 0; 
                                                                this.state.groupExpensesSummary && this.state.groupExpensesSummary.map((expense) => {
                                                                    if(expense.currency === currency && expense.receiver === member){
                                                                        amountPerCurrency = amountPerCurrency - expense.amount_to_give + expense.amount_to_recieve;
                                                                    }
                                                                    return(<></>)
                                                                });

                                                                if(index === 0){
                                                                    return( 
                                                                        <tr style={{border: "1px solid black"}} key={`${member}-${currency}-${index}`}>
                                                                            <td style={{border: "1px solid black"}} rowSpan={arr.length}>{member}</td>
                                                                            <td style={{border: "1px solid black"}}>{amountPerCurrency}</td>
                                                                            <td style={{border: "1px solid black"}}>{this.state.currenciesListArr[index]}</td>
                                                                        </tr>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <tr style={{border: "1px solid black"}} key={`${member}-${currency}-${index}`}>
                                                                            <td style={{border: "1px solid black"}}>{amountPerCurrency}</td>
                                                                            <td style={{border: "1px solid black"}}>{this.state.currenciesListArr[index]}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                        {
                                                            (!this.state.currenciesListArr || this.state.currenciesListArr.length === 0) && this.state.groupMembers.map((user, i) => {
                                                                if(user === member){
                                                                    return(
                                                                        <tr style={{border: "1px solid black"}} key={`${user}${i}`}>
                                                                            <td style={{border: "1px solid black"}}>{member}</td>
                                                                            <td style={{border: "1px solid black"}}> - </td>
                                                                            <td style={{border: "1px solid black"}}> - </td>
                                                                        </tr>
                                                                    )
                                                                } else {
                                                                    return(<React.Fragment key={`${user}.${i}`}></React.Fragment>)
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

                                <div style={{marginLeft: '30px'}}>
                                    <h3>Individual Balances</h3>
                                    <table style={{border: "1px solid black"}}> 
                                        <tbody>
                                            <tr style={{border: "1px solid black"}}>
                                                <th style={{border: "1px solid black"}} rowSpan='3'>Member</th>
                                                <th style={{border: "1px solid black"}} colSpan="3">Other Members</th>
                                            </tr> 
                                            <tr style={{border: "1px solid black"}}>
                                                <th style={{border: "1px solid black"}} rowSpan='2'>Member</th>
                                                <th style={{border: "1px solid black"}} colSpan='2'>Current Balance</th>
                                            </tr>
                                            <tr style={{border: "1px solid black"}}>
                                                <th style={{border: "1px solid black"}}>Balance <HelpOutlineRoundedIcon style={{fontSize: '20px'}} onClick={() => {this.setState({balancePopupStatus: true})}}/></th>
                                                <th style={{border: "1px solid black"}}>Currency</th>
                                            </tr>

                                            {
                                                this.state.groupMembers && this.state.groupMembers.map((member, index, arr) => {
                                                    const otherGroupMembers = arr.filter((el) => el !== member);
                                                    return(
                                                    <React.Fragment key={`mainMember:${member}`}>
                                                    {
                                                        otherGroupMembers && otherGroupMembers.map((otherUser, ind, array) => {
                                                            if(ind === 0){
                                                                return(
                                                                    <React.Fragment key={`otherGroupMembers:${otherUser}`}>
                                                                    {
                                                                        this.state.currenciesListArr && this.state.currenciesListArr.map((currency, inde, arra) => {
                                                                            let amountMoney = 0;
                                                                            if(inde === 0){
                                                                                return(
                                                                                    <React.Fragment key={`otherUser:${currency}-${otherUser}`}>
                                                                                    {
                                                                                        this.state.groupExpensesSummary && this.state.groupExpensesSummary.map((exp, indexx, arrayy) => {
                                                                                            if(exp.currency === currency){
                                                                                                // get expenses where creator is current group member
                                                                                                if(exp.buyer === member){
                                                                                                    if(exp.receiver === otherUser){
                                                                                                        amountMoney = amountMoney - exp.amount_to_give;
                                                                                                    }
                                                                                                // get expense when creator is not current group member
                                                                                                } else { 
                                                                                                    if(exp.receiver === member && exp.buyer === otherUser){
                                                                                                        amountMoney = amountMoney + exp.amount_to_give;
                                                                                                    }
                                                                                                }
                                                                                            }

                                                                                            if(indexx === arrayy.length - 1){
                                                                                                return (
                                                                                                    <tr style={{border: "1px solid black"}} key={`totalBalance:${member}-${currency}-${otherUser}-${amountMoney}`}>
                                                                                                        <th style={{border: "1px solid black"}} rowSpan={(arr.length-1)*(arra.length)}>{member}</th>
                                                                                                        <td style={{border: "1px solid black"}} rowSpan={arra.length}>{otherUser}</td>
                                                                                                        <td style={{border: "1px solid black"}}>{amountMoney}</td>
                                                                                                        <td style={{border: "1px solid black"}}>{currency}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                        return(<></>)
                                                                                        })
                                                                                    }
                                                                                    </React.Fragment>
                                                                                    
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <React.Fragment key={`otherUser:${currency}-${otherUser}`}>
                                                                                    {
                                                                                        this.state.groupExpensesSummary && this.state.groupExpensesSummary.map((exp, indexx, arrayy) => {
                                                                                            if(exp.currency === currency){
                                                                                                // get expenses where creator is current group member
                                                                                                if(exp.buyer === member){
                                                                                                    if(exp.receiver === otherUser){
                                                                                                        amountMoney = amountMoney - exp.amount_to_give;
                                                                                                    }
                                                                                                // get expense when creator is not current group member
                                                                                                } else { 
                                                                                                    if(exp.receiver === member && exp.buyer === otherUser){
                                                                                                        amountMoney = amountMoney + exp.amount_to_give;
                                                                                                    }
                                                                                                }
                                                                                            }

                                                                                            if(indexx === arrayy.length - 1){
                                                                                                return (
                                                                                                    <tr style={{border: "1px solid black"}} key={`totalBalance:${member}-${currency}-${otherUser}-${amountMoney}`}>
                                                                                                        <td style={{border: "1px solid black"}}>{amountMoney}</td>
                                                                                                        <td style={{border: "1px solid black"}}>{currency}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            return(<></>)
                                                                                        })
                                                                                    }
                                                                                    </React.Fragment> 
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                    
                                                                    </React.Fragment>
                                                                )
                                                            } else {
                                                                return(
                                                                    <React.Fragment key={`otherGroupMembers:${otherUser}`}>
                                                                    {
                                                                        this.state.currenciesListArr && this.state.currenciesListArr.map((currency, inde, arra) => {
                                                                            let amountMoney = 0;
                                                                            if(inde === 0){
                                                                                return(
                                                                                    <React.Fragment key={`otherUser:${currency}-${otherUser}-${inde}`}>
                                                                                    {
                                                                                        this.state.groupExpensesSummary && this.state.groupExpensesSummary.map((exp, indexx, arrayy) => {
                                                                                            if(exp.currency === currency){
                                                                                                // get expenses where creator is current group member
                                                                                                if(exp.buyer === member){
                                                                                                    if(exp.receiver === otherUser){
                                                                                                        amountMoney = amountMoney - exp.amount_to_give;
                                                                                                    }
                                                                                                // get expense when creator is not current group member
                                                                                                } else { 
                                                                                                    if(exp.receiver === member && exp.buyer === otherUser){
                                                                                                        amountMoney = amountMoney + exp.amount_to_give;
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                            
                                                                                            if(indexx === arrayy.length - 1){
                                                                                                return (
                                                                                                    <tr style={{border: "1px solid black"}} key={`totalBalance:${member}-${currency}-${otherUser}-${amountMoney}`}>
                                                                                                        <td style={{border: "1px solid black"}} rowSpan={arra.length}>{otherUser}</td>
                                                                                                        <td style={{border: "1px solid black"}}>{amountMoney}</td>
                                                                                                        <td style={{border: "1px solid black"}}>{currency}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            return(<></>)
                                                                                        })
                                                                                    }
                                                                                    </React.Fragment>
                                                                                    
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <React.Fragment key={`otherUser:${currency}-${otherUser}-${inde}`}>
                                                                                    {
                                                                                        this.state.groupExpensesSummary && this.state.groupExpensesSummary.map((exp, indexx, arrayy) => {
                                                                                            if(exp.currency === currency){
                                                                                                // get expenses where creator is current group member
                                                                                                if(exp.buyer === member){
                                                                                                    if(exp.receiver === otherUser){
                                                                                                        amountMoney = amountMoney - exp.amount_to_give;
                                                                                                    }
                                                                                                // get expense when creator is not current group member
                                                                                                } else { 
                                                                                                    if(exp.receiver === member && exp.buyer === otherUser){
                                                                                                        amountMoney = amountMoney + exp.amount_to_give;
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                            
                                                                                            if(indexx === arrayy.length - 1){
                                                                                                return (
                                                                                                    <tr style={{border: "1px solid black"}} key={`totalBalance:${member}-${currency}-${otherUser}-${amountMoney}`}>
                                                                                                        <td style={{border: "1px solid black"}}>{amountMoney}</td>
                                                                                                        <td style={{border: "1px solid black"}}>{currency}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            return(<></>)
                                                                                        })
                                                                                    }
                                                                                    </React.Fragment>
                                                                                    
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                    </React.Fragment> 
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
                                                <th style={{border: "1px solid black", padding: '3px'}}>Delete Expense</th>
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
                                                            return(<></>)
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
                                                                                `${index === arr.length-2 && arr.length > 2?
                                                                                    `and ${member}` :
                                                                                    `${arr.length === 2?
                                                                                        `${member}` :
                                                                                        `${index === arr.length-3 ?
                                                                                            `${member} ` :
                                                                                            `${member}, `}`}`}` :
                                                                            `${index === arr.length-1 && arr.length > 1?
                                                                                `and ${member}` :
                                                                                `${arr.length === 1?
                                                                                    `${member}` :
                                                                                    `${index === arr.length-2 ?
                                                                                        `${member} ` :
                                                                                        `${member}, `
                                                                                        }`
                                                                                    }`
                                                                                }`
                                                                            }`
                                                                        }`) 
                                                                    })}</td>
                                                                    <td style={{border: "1px solid black", padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                        <button id={expense[0]} onClick={this.partialDeleteExpense} className={`delete-btn-elements-${expense[0]}`}><div className='navBarIcons' id={expense[0]}>< DeleteOutlineOutlinedIcon id={expense[0]}/> delete</div></button>
                                                                        <button id={`confirm-${expense[0]}`} style={{display: 'none'}} onClick={this.deleteExpense} className={`confirm-btn-elements-${expense[0]}`}><div className='navBarIcons' id={`confirm-${expense[0]}`}>< CheckCircleOutlineOutlinedIcon id={`confirm-${expense[0]}`}/> Confirm</div></button>
                                                                        <button id={`cancel-${expense[0]}`} style={{display: 'none'}} onClick={this.cancelDelete} className={`cancel-btn-elements-${expense[0]}`}><div className='navBarIcons' id={`cancel-${expense[0]}`}>< CancelOutlinedIcon id={`cancel-${expense[0]}`}/> Cancel</div></button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    }
                                                    return(<></>)
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button onClick={this.addExpense} style={{marginBottom: '10px'}}className="iconBtn">< PlaylistAddOutlinedIcon style={{marginRight: '4px'}}/> add expense</button>
                        </div>
                    </div>
                );
            } else if (this.state.signedIn != null && this.state.groupName == null){
                return (
                    <div>
                        {this.redirectNoGroupSelected()}
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
            <div>
               {checkSignedIn()}
               < BalanceBackdrop changePopup={this.changePopup} balancePopupStatus={this.state.balancePopupStatus}/>
            </div>
        )
    }
}
export default OpenGroup;