import React from "react";
import { Link } from "react-router-dom";
import RedirectedMessage from "./RedirectedMessage";

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
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{border: '1px solid black', width: '200px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px'}}>
                        <h1>groups</h1>
                        <p><Link to="/groups">See more</Link></p>
                    </div>
                    <div style={{border: '1px solid black', width: '200px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px'}}>
                        <h1>new group</h1>
                        <p><Link to="/create">create new groups</Link></p>
                    </div>
                    <div style={{border: '1px solid black', width: '200px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px'}}>
                        <h1>group requests</h1>
                        <p><Link to="/requests">respond</Link></p>
                    </div>
                </div>
                );
            } else {
                return (
                    <div>
                        <p>The user is not signed in</p>
                    </div>
                    
                );
            }
        }

        return(
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', height: '60vh'}}>
               <h1>Home page</h1>
               {checkSignedIn()}
               < RedirectedMessage isOpen = {this.state.redirectMessage} changeIsOpen = {this.changeIsOpenMessage} message = {this.state.redirectReason}/>
            </div>
        )
    }
}
export default Home;