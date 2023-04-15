import React from "react";
import { Link } from "react-router-dom";
import RedirectedMessage from "./RedirectedMessage";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            redirectMessage: false,
            redirectReason: localStorage.getItem("redirectMessage"),
        }
    }
    notConsoled = true
    componentDidMount(){
        const signedIn = localStorage.getItem("signedin");
        
        if(this.notConsoled){
            this.notConsoled = false;
            console.log(signedIn);

            // check if redirected from another page 
            if(this.state.redirectReason !== null){
                this.setState({redirectMessage: true});
            }
        } 
    }

    changeIsOpenMessage = (visibility) => {
        this.setState({redirectMessage: visibility});
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                <div style={{minHeight: '800px'}} className='centerColumnContent'>
                    <h1 id='homePageTitle'>SpotMe</h1>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        
                        <div className='homePageOptionDiv'>
                            <h1>all <br></br>groups</h1>
                            <button className='homePageOptionBtn' onClick={() => {window.location.href = '/groups'}}><Link to="/groups" className='homePageOptionBtnInnerText'>See more</Link></button>
                        </div>
                        <div className='homePageOptionDiv'>
                            <h1>new group</h1>
                            <button className='homePageOptionBtn' onClick={() => {window.location.href = '/create'}}><Link to="/create" className='homePageOptionBtnInnerText'>create new groups</Link></button>
                        </div>
                        <div className='homePageOptionDiv'>
                            <h1>group requests</h1>
                            <button className='homePageOptionBtn' onClick={() => {window.location.href = '/requests'}}><Link to="/requests" className='homePageOptionBtnInnerText'>respond</Link></button>
                        </div>
                    </div>
                </div>
                );
            } else {
                return (
                    <div className='fullPageWidth'>
                        <div id='mainSpotMeDiv'>
                            <div>
                                <h1 id='spotMeTitle'>SpotMe</h1>
                                <p id='spotMeSubtitle'>split expenses, settle up, no fuss</p>
                                <button id='spotMeBtn' onClick={() => {window.location.href = '/register'}}><Link to="/register" id='spotMeBtnInnerText'>Get started today</Link></button>
                            </div>
                            <img src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80" alt="usingWebsite" id='spotMeMainImage'/>
                        </div>
                        <div id='homePageNotLoggedInDivs'>
                            <div id='inActionDiv'>
                                <h2 id='inActionTitle'>In action</h2>
                                <div id='inActionMainContent'>
                                    <div>
                                        <h3 className='inActionSubtitles'>Enjoy stress free group outings</h3>
                                        <p className='inActionSubcontent'>As we keep track of shared purchases</p>

                                        <h3 className='inActionSubtitles'>Create efficient shared living arangments</h3>
                                        <p className='inActionSubcontent'>As we remind your roomates to pay what they owe</p>

                                        <h3 className='inActionSubtitles'>Plan parties with ease</h3>
                                        <p className='inActionSubcontent'>with all your purchases visible in one place</p>
                                    </div>
                                    
                                    <img src="https://images.unsplash.com/photo-1590650046871-92c887180603?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80" alt="planning" id='inActionImg'/>
                                </div>
                            </div>
                            <div id='funThingsDiv'>
                                <h2 id='funThingsTitle'>Get on with the fun things in life, only a click away</h2>
                                <div id='funThingsMainContent'>
                                    <div>
                                        <ul id='funThingsList'>
                                            <li className="funThingsListitem"><span style={{fontWeight: '900', color: '#bc6630', fontSize: '24px'}}>NO</span> hidden expenses</li>
                                            <li className="funThingsListitem"> <span style={{fontWeight: '900', color: '#bc6630', fontSize: '24px'}}>NO</span> card details required</li>
                                            <li className="funThingsListitem">completely <span style={{fontWeight: '900', color: '#bc6630', fontSize: '24px'}}>FREE</span> to use!</li>
                                        </ul>
                                        <button id='tryItForFreeBtn' onClick={() => {window.location.href = '/register'}}><Link to="/register" className='navBarIcons' id='tryItForFreeBtnInnerText'><PersonAddAlt1Icon style={{fontSize: '42px'}}/>Try it for yourself</Link></button>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1555817129-2fa6b81bd8e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" alt="havingFun" id='havingFunImg'/>
                                </div>
                                
                            </div>
                            <div id='homeBenefitsDiv'>
                                <h2 id='homeBenefitsTitle'>Benefits</h2>
                                <div id='homeBenefitsMainContent'>
                                    <div style={{textAlign: 'left', width: '360px'}}>
                                        <p className="homeBenefitsLines">All your group expenses in one place in easy to read diagrams</p>
                                        <p className="homeBenefitsLines">Filter group expenses by: name, purchaser, purchasees, and more!</p>
                                        <p className="homeBenefitsLines">Keep track of expenses made in over 150 currencies!</p>
                                        <p className="homeBenefitsLines">Export group summaries to a pdf to share externally</p>
                                        <p className="homeBenefitsLines">convert individual balances to a single currency *</p>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1715&q=80" alt="benefits" id='benefitsImg'/>
                                </div>
                            </div>
                        </div>
                        

                        <div id='homePageBottomBtnsDiv'>
                            <button style={{marginRight: '20px'}} className='homePageBottomBtns' onClick={() => {window.location.href = '/login'}}><Link to="/login" className='labelWithIcon homePageBottomBtnsContent'><LoginTwoToneIcon style={{marginRight: '8px'}}/>Login</Link></button>
                            <button style={{marginLeft: '20px'}} className='homePageBottomBtns' onClick={() => {window.location.href = '/register'}}><Link to="/register" className='labelWithIcon homePageBottomBtnsContent'><PersonAddAlt1Icon style={{marginRight: '8px'}}/>Sign Up</Link></button>
                        </div>
                        <p id='disclaimerText'>* for selected applicable currencies </p>
                    </div>
                    
                );
            }
        }

        return(
            <div id='homePage' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}}>
               {checkSignedIn()}
               < RedirectedMessage isOpen = {this.state.redirectMessage} changeIsOpen = {this.changeIsOpenMessage} message = {this.state.redirectReason}/>
            </div>
        )
    }
}
export default Home;