import React from 'react';
import MembersInvolvedDropdown from "./specificGroupComponents/MembersInvolvedDropdown";
import CurrencyDropdown from "./specificGroupComponents/CurrencyDropdown";
import PayedByDropdown from "./specificGroupComponents/PayedByDropdown";
import ExpensesDropdown from "./specificGroupComponents/ExpensesDropdown";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import BalanceBackdrop from "./BalanceBackdrop";
import ExpensesSummaryDropdown from './expensesSummaryComponents/ExpensesSummaryDropdown';
import ValidCurrencies from './conversionComponents/ValidCurrencies.json';
import ConvertedPopup from './conversionComponents/ConvertedPopup';

class OpenGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
            groupName: localStorage.getItem("groupName"),
            balancePopupStatus: false,
            convertPopupOpen: false,
            convertedData: null,
            baseCurrencyStr: null,
            originalBalanceArr: null,
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
                this.setState({groupMembers: responseJ.UsersArr}, () => {

                    // for how much money members owe specific person dropdown 
                    this.state.groupMembers.forEach((member) => {
                        const membersinput = document.getElementById("membersSelect");
                        const newInput = document.createElement('option');
                        if(member === this.state.signedIn){
                            newInput.innerHTML = 'you';
                        } else {
                            newInput.innerHTML = member;
                        }
                        newInput.value = member;
                        membersinput.append(newInput);
                    })
                });

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

                        // for how much individuals owe specific member
                        const individualOwingsSelect = document.getElementById('membersSelect');
                        if (individualOwingsSelect.value !== ''){
                            this.displayIndividualOwings(individualOwingsSelect.value);
                        }
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


    getUserForIndividualOwings = (e) => {
        this.displayIndividualOwings(e.target.value);
    }

    convertToCurrency = (e) => {
        let currenciesToConvertString = '';
        let originalBalances = [];
        const allCurrencyOwings = document.querySelectorAll( `.owingTotalPerCurrencyOf-${e.target.id}`);
        allCurrencyOwings.forEach((currency) => {
            let originalBalance = [];
            if (currency.hasAttribute('id')){
                originalBalance.push(currency.id.split('&'));
                originalBalances.push(originalBalance);
                if(currenciesToConvertString === ''){
                    currenciesToConvertString = currency.id.split('&')[1];
                } else {
                    currenciesToConvertString = `${currenciesToConvertString},${currency.id.split('&')[1]}`;
                }
            }
        })
        const baseCurrency = document.getElementById(`convertDropdown-${e.target.id}`).value;
        const baseCurrencyName = document.getElementById(`convertDropdown-${e.target.id}-${baseCurrency}`).textContent.split(' ').join('#');
        this.fetchApi(baseCurrency, currenciesToConvertString, originalBalances, baseCurrencyName);
    }

    fetchApi = async (baseCurrency, currenciesToConvert, originals, baseName) => {
        const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=a7XUjX4tfqeUJUCW0qQDMV8FTCiuGf3ohXxu2Scm&base_currency=${baseCurrency}&currencies=${currenciesToConvert}`);
        const jsonedResponse = await response.json();
        this.setState({convertedData: jsonedResponse}, () => {
            this.setState({baseCurrencyStr: baseName}, () => {
                this.setState({originalBalanceArr: originals}, () => {
                    this.setState({convertPopupOpen: true});
                })
            })
        })
    }

    // for closing convert popup 
    closePopup = (status) => {
        this.setState({convertPopupOpen: status});
        if (status === false){
            this.setState({convertedData: null}); 
            this.setState({baseCurrencyStr: null});
            this.setState({originalBalanceArr: null});
        }
    }

    displayIndividualOwings = (currentUser) => {
        const container = document.getElementById('allMembersOwings');
        container.replaceChildren();
        this.state.groupMembers.forEach((member) => {
            if(member !== currentUser){
                const newMemberDiv = document.createElement('div');
                const newMemberDivName = document.createElement('h4');
                newMemberDivName.className = 'eachMemberOwesName'
                newMemberDivName.innerHTML = member;
                newMemberDiv.append(newMemberDivName);

                // for conversion api 
                const convertButton = document.createElement('button');
                convertButton.innerHTML = 'convert all possible balances (in green) to...'
                convertButton.id = member;
                convertButton.className = 'convertAllPossibleBalancesBtns';
                convertButton.addEventListener ('click', this.convertToCurrency);
                const dropdown = document.createElement('select');
                dropdown.id = `convertDropdown-${member}`;
                dropdown.className = 'convertAllPossibleBalancesDropdowns'
                ValidCurrencies.forEach((cur) => {
                    const newOption = document.createElement('option');
                    newOption.value = cur.code;
                    newOption.id = `convertDropdown-${member}-${cur.code}`;
                    newOption.innerHTML = cur.name;
                    dropdown.append(newOption);
                })

                const buttonDiv = document.createElement('div');
                buttonDiv.append(convertButton);
                buttonDiv.append(dropdown);

                this.state.currenciesListArr.forEach((currency) => {
                    let amountMoney = 0;
                    let valid = false;
                    let code; 
                    let validName;
                    this.state.groupExpensesSummary.forEach((exp, index, array) => {
                        if(exp.currency === currency){
                            // get expenses where creator is current group member
                            if(exp.buyer === currentUser){
                                if(exp.receiver === member){
                                    amountMoney = amountMoney - exp.amount_to_give;
                                }
                            // get expense when creator is not current group member
                            } else { 
                                if(exp.receiver === currentUser && exp.buyer === member){
                                    amountMoney = amountMoney + exp.amount_to_give;
                                }
                            }
                        }

                        
                        if(index === array.length - 1){
                            const currencyType = document.createElement('p');
                            (amountMoney !== 1 && amountMoney !== -1) ? currencyType.innerHTML = `${currency}s` : currencyType.innerHTML = currency;
                            currencyType.style = 'display: inline'
                            const amountDue = document.createElement('p');
                            amountDue.innerHTML = amountMoney * -1;
                            amountDue.style = 'display: inline; margin-Right: 10px';
                            const owingTotalPerCurrency = document.createElement('div');
                            owingTotalPerCurrency.className = `owingTotalPerCurrencyOf-${member}`;

                            // check if ValidCurrencies
                            ValidCurrencies.forEach((cur) => {
                                if (cur.name === currency){
                                    code = cur.code;
                                    validName = cur.name.split(' ').join('#');
                                    valid = true;  
                                }
                            })

                            if (valid) {
                                owingTotalPerCurrency.style = 'background-color: rgb(182, 255, 133); padding: 5px; border-radius: 15px; margin-bottom: 5px; color:rgb(89, 141, 82);';
                                owingTotalPerCurrency.id = `${amountMoney}&${code}&${validName}`
                            } else {
                                owingTotalPerCurrency.style = 'background-color: rgb(242, 71, 68); padding: 5px; border-radius: 15px; margin-bottom: 5px; color:rgb(129, 34, 34);';
                            }
                            owingTotalPerCurrency.append(amountDue);
                            owingTotalPerCurrency.append(currencyType);
                            newMemberDiv.append(owingTotalPerCurrency);
                            container.append(newMemberDiv);
                        }
                    })     
                });
                if(this.state.groupExpensesSummary.length !== 0){
                    container.append(buttonDiv);
                } else {
                    container.innerHTML = 'no expenses added';
                    container.style = '  color: rgb(163, 169, 173);  background-color: rgb(234, 234, 234); border-radius: 15px; padding: 10px 5px 10px 5px;  font-size: 22px; margin-bottom: 15px;';
                }
            }
        })
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null && this.state.groupName != null) {
                return (
                    <div>
                        <div className="openGroupTitleDiv">
                            <h3 className='openGroupTitle'>Group:</h3>
                            <h4 className='openGroupTitleName'>{this.state.groupName}</h4>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div>
                                <h3 className='openGroupSubtitles'>Groups Members: </h3>
                                <ul id='openGroupMembersList'>{this.state.groupMembers && this.state.groupMembers.map((member) => {
                                    return (<li key={member} id='openGroupMembersListItem'>{member}</li>)
                                })
                                }</ul>
                            </div>
                            <div>
                                <h3 className='openGroupSubtitles'>Each Member owes <select id="membersSelect" name="membersSelect" defaultValue="" onChange={this.getUserForIndividualOwings}> <option disabled hidden value="">Select Member</option></select> the amount of...</h3>
                                <div id='allMembersOwings' style={{marginBottom: '20px'}}>

                                </div>
                            </div>
                            <div> 
                            { (this.state.groupMembers && this.state.currenciesListArr && this.state.groupExpensesSummary)? < ExpensesSummaryDropdown groupMembers={this.state.groupMembers} currenciesListArr = {this.state.currenciesListArr} groupExpensesSummary={this.state.groupExpensesSummary} changePopup={this.changePopup}/> : <></>}
                            </div>

                            <div>
                                <h3 className='openGroupSubtitles'>List of Expenses</h3>
                                <div style={{display: 'flex', flexDirection: 'column',  width: '800px'}}>
                                    <h4 className='openGroupSmallerSubtitles'>Filters</h4>
                                    { this.state.expensesListArr? < ExpensesDropdown ExpensesArr={this.state.expensesListArr} updateExpenseDisplayed={this.updateExpenseDisplayed}/> : ''}
                                    { this.state.groupMembers? < PayedByDropdown groupNamesArr={this.state.groupMembers} updatePayedByDisplayed={this.updatePayedByDisplayed}/> : ''}
                                    { this.state.currenciesListArr? < CurrencyDropdown currenciesArr={this.state.currenciesListArr} updateCurrencyDisplayed={this.updateCurrencyDisplayed}/> : ''}
                                    { this.state.groupMembers? < MembersInvolvedDropdown groupNamesArr={this.state.groupMembers} updateLoaneeDisplayed={this.updateLoaneeDisplayed}/> : ''}
                                </div>
                                <div className='centerColumnContent'>
                                    <h4 className='openGroupSmallerSubtitles'>Expenses</h4>
                                    <table id='expensesTable'> 
                                        <tbody>
                                            <tr>
                                                <th className='expensesTableTitles'>Expense</th>
                                                <th className='expensesTableTitles'>Payed by</th>
                                                <th className='expensesTableTitles'>Amount</th>
                                                <th className='expensesTableTitles'>Currency</th>
                                                <th className='expensesTableTitles'>Loanees</th>
                                                <th className='expensesTableTitles'>Delete Expense</th>
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
                                                            return(<React.Fragment key={`${expense[1].currency}-${expense[0]}-${expense[1].buyer}`}></React.Fragment>)
                                                        })
                                                        if(loaneeInIncluded){
                                                            return (
                                                                <tr key={expense[0]}>
                                                                    <td className='expensesTableInputs'>{expense[0]}</td> 
                                                                    <td className='expensesTableInputs'>{expense[1].buyer}</td>
                                                                    <td className='expensesTableInputs'>{expense[1].amount}</td>
                                                                    <td className='expensesTableInputs'>{expense[1].currency}</td>
                                                                    <td className='expensesTableInputs'>{expense[1].involved.map((member, index, arr) => {
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
                                                                    <td className='expensesTableInputs' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                        <button id={expense[0]} onClick={this.partialDeleteExpense} className={`delete-btn-elements-${expense[0]} editExpenseTableBtns`}><div className='navBarIcons' id={expense[0]}>< DeleteOutlineOutlinedIcon className = 'importedLogos' /> delete</div></button>
                                                                        <button id={`confirm-${expense[0]}`} style={{display: 'none'}} onClick={this.deleteExpense} className={`confirm-btn-elements-${expense[0]} editExpenseTableBtns`}><div className='navBarIcons' id={`confirm-${expense[0]}`}>< CheckCircleOutlineOutlinedIcon className = 'importedLogos'/> Confirm</div></button>
                                                                        <button id={`cancel-${expense[0]}`} style={{display: 'none'}} onClick={this.cancelDelete} className={`cancel-btn-elements-${expense[0]} editExpenseTableBtns`}><div className='navBarIcons' id={`cancel-${expense[0]}`}>< CancelOutlinedIcon className = 'importedLogos'/> Cancel</div></button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    }
                                                 return(<React.Fragment key={`overall--${expense[1].currency}-${expense[0]}-${expense[1].buyer}`}></React.Fragment>)
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button onClick={this.addExpense} style={{marginBottom: '10px'}}className="iconBtn" id='addNewExpenseBtn'>< PlaylistAddOutlinedIcon style={{marginRight: '4px'}} className = 'importedLogos'/> add expense</button>
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
            <div style={{minHeight: '800px'}}>
               {checkSignedIn()}
               < BalanceBackdrop changePopup={this.changePopup} balancePopupStatus={this.state.balancePopupStatus}/>
               { (this.state.convertedData !== null && this.state.baseCurrencyStr !== null && this.state.originalBalanceArr !== null) && < ConvertedPopup isOpen = {this.state.convertPopupOpen} changeOpen={this.closePopup} dataToDisplay={this.state.convertedData} base={this.state.baseCurrencyStr} original={this.state.originalBalanceArr}/> }
            </div>
        )
    }
}
export default OpenGroup;