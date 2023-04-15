import React, { forwardRef } from "react";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

const ExpensesSummary = forwardRef((props, ref) => {
    const groupMembers = props.groupMembers;
    const currenciesListArr = props.currenciesListArr;
    const groupExpensesSummary = props.groupExpensesSummary;

    return (
        <div ref={ref}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
                <div style={{marginRight: '30px'}}>
                    <h3 className='openGroupSubtitles'>Overview</h3>
                    <table className='expenseOverviewTable'> 
                        <thead className='expenseOverviewTableBody'>
                            <tr>
                                <th className='memberInputExpenseOverviewTable'rowSpan='2'>Member</th>
                                <th className='curentBalanceExpenseOverviewTable' colSpan="2">Current Balance</th>
                            </tr>
                            <tr>
                                <th className='balanceCurrencyInputExpenseOverviewTable'>Balance <HelpOutlineRoundedIcon style={{fontSize: '20px'}} onClick={() => {props.changePopup(true)}}/></th>
                                <th className='balanceCurrencyInputExpenseOverviewTable'>Currency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                
                                groupMembers && groupMembers.map((member) => {
                                    return(
                                        <React.Fragment key={`groupMembers:${member}`}>
                                        {
                                            currenciesListArr && currenciesListArr.map((currency, index, arr) => {
                                                let amountPerCurrency = 0; 
                                                groupExpensesSummary && groupExpensesSummary.map((expense) => {
                                                    if(expense.currency === currency && expense.receiver === member){
                                                        amountPerCurrency = amountPerCurrency - expense.amount_to_give + expense.amount_to_recieve;
                                                    }
                                                    return(<React.Fragment key={`${expense}-${index}-${currency}`}></React.Fragment>)
                                                });

                                                if(index === 0){
                                                    return( 
                                                        <tr key={`${member}-${currency}-${index}`}>
                                                            <td className='memberLeftInputExpenseOverviewTable' rowSpan={arr.length}>{member}</td>
                                                            <td className='amountInputExpenseOverviewTable'>{amountPerCurrency}</td>
                                                            <td className='currencyInputExpenseOverviewTable'>{currenciesListArr[index]}</td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr key={`${member}-${currency}-${index}`}>
                                                            <td className='amountInputExpenseOverviewTable'>{amountPerCurrency}</td>
                                                            <td className='currencyInputExpenseOverviewTable'>{currenciesListArr[index]}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                        {
                                            (!currenciesListArr || currenciesListArr.length === 0) && groupMembers.map((user, i) => {
                                                if(user === member){
                                                    return(
                                                        <tr key={`${user}${i}`}>
                                                            <td className='memberLeftInputExpenseOverviewTable'>{member}</td>
                                                            <td className='amountInputExpenseOverviewTable'> - </td>
                                                            <td className='currencyInputExpenseOverviewTable'> - </td>
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
                    <h3 className='openGroupSubtitles'>Individual Balances</h3>
                    { currenciesListArr.length !== 0? 
                        <table className='expenseOverviewTable'> 
                            <thead className='expenseOverviewTableBody'>
                                <tr>
                                    <th className='mainMemberInputExpenseOverviewTable' rowSpan='3'>Member</th>
                                    <th className='higherMemberInputExpenseOverviewTable' colSpan="3">Other Members</th>
                                    </tr> 
                                <tr>
                                    <th className='memberInputExpenseOverviewTable' rowSpan='2'>Member</th>
                                    <th className='curentBalanceExpenseOverviewTable' colSpan='2'>Current Balance</th>
                                </tr>
                                <tr>
                                    <th className='balanceCurrencyInputExpenseOverviewTable'>Balance <HelpOutlineRoundedIcon style={{fontSize: '20px'}} onClick={() => {props.changePopup(true)}}/></th>
                                    <th className='balanceCurrencyInputExpenseOverviewTable'>Currency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    groupMembers && groupMembers.map((member, index, arr) => {
                                        const otherGroupMembers = arr.filter((el) => el !== member);
                                        return(
                                            <React.Fragment key={`mainMember:${member}`}>
                                            {
                                                otherGroupMembers && otherGroupMembers.map((otherUser, ind, array) => {
                                                    if(ind === 0){
                                                        return(
                                                            <React.Fragment key={`otherGroupMembers:${otherUser}`}>
                                                            {
                                                                currenciesListArr && currenciesListArr.map((currency, inde, arra) => {
                                                                    let amountMoney = 0;
                                                                    if(inde === 0){
                                                                        return(
                                                                            <React.Fragment key={`otherUser:${currency}-${otherUser}`}>
                                                                            {
                                                                                groupExpensesSummary && groupExpensesSummary.map((exp, indexx, arrayy) => {
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
                                                                                            <tr key={`totalBalance:${member}-${currency}-${otherUser}-${amountMoney}`}>
                                                                                                <th className='biggerMemberLeftInputExpenseOverviewTable' rowSpan={(arr.length-1)*(arra.length)}>{member}</th>
                                                                                                <td className='memberLeftInputExpenseOverviewTable' rowSpan={arra.length}>{otherUser}</td>
                                                                                                <td className='amountInputExpenseOverviewTable'>{amountMoney}</td>
                                                                                                <td className='currencyInputExpenseOverviewTable'>{currency}</td>
                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                    return(<React.Fragment key={`returningBalance-${indexx}-${ind}`}></React.Fragment>)
                                                                                })
                                                                            }
                                                                            </React.Fragment>        
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <React.Fragment key={`otherUser:${currency}-${otherUser}`}>
                                                                            {
                                                                                groupExpensesSummary && groupExpensesSummary.map((exp, indexx, arrayy) => {
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
                                                                                            <tr key={`totalBalance:${member}-${currency}-${otherUser}-${amountMoney}`}>
                                                                                                <td className='amountInputExpenseOverviewTable'>{amountMoney}</td>
                                                                                                <td className='currencyInputExpenseOverviewTable'>{currency}</td>
                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                    return(<React.Fragment key={`${exp}-${indexx}-otherUsersBalance`}></React.Fragment>)
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
                                                                currenciesListArr && currenciesListArr.map((currency, inde, arra) => {
                                                                    let amountMoney = 0;
                                                                    if(inde === 0){
                                                                        return(
                                                                            <React.Fragment key={`otherUser:${currency}-${otherUser}-${inde}`}>
                                                                            {
                                                                                groupExpensesSummary && groupExpensesSummary.map((exp, indexx, arrayy) => {
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
                                                                                            <tr key={`totalBalance:${member}-${currency}-${otherUser}-${amountMoney}`}>
                                                                                                <td className='memberLeftInputExpenseOverviewTable' rowSpan={arra.length}>{otherUser}</td>
                                                                                                <td className='amountInputExpenseOverviewTable'>{amountMoney}</td>
                                                                                                <td className='currencyInputExpenseOverviewTable'>{currency}</td>
                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                    return(<React.Fragment key={`${exp.buyer}-balance-${otherUser}-${indexx}`}></React.Fragment>)
                                                                                })
                                                                            }
                                                                            </React.Fragment>       
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <React.Fragment key={`otherUser:${currency}-${otherUser}-${inde}`}>
                                                                            {
                                                                                groupExpensesSummary && groupExpensesSummary.map((exp, indexx, arrayy) => {
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
                                                                                            <tr key={`totalBalance:${member}-${currency}-${otherUser}-${amountMoney}`}>
                                                                                                <td className='amountInputExpenseOverviewTable'>{amountMoney}</td>
                                                                                                <td className='currencyInputExpenseOverviewTable'>{currency}</td>
                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                    return(<React.Fragment key={`${indexx}-${exp.reciever}-otherUsers`}></React.Fragment>)
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
                        </table> : <p> No expenses added</p>
                }
                </div>
            </div>
        </div>
    )
});

export default ExpensesSummary;
