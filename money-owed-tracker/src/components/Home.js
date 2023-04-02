import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
        }
    }
    notConsoled = true
    componentDidMount(){
        const signedIn = localStorage.getItem("signedin");
        
        if(this.notConsoled){
            this.notConsoled = false;
            console.log(signedIn);
        }
        
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                <div>
                    <div>
                        <h1>groups</h1>
                        <p><Link to="/groups">See more</Link></p>
                    </div>
                    <div>
                        <h1>new group</h1>
                        <p><Link to="/create">create new groups</Link></p>
                    </div>
                    <div>
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
            <div>
               <h1>Home page</h1>
               {checkSignedIn()}
            </div>
        )
    }
}
export default Home;