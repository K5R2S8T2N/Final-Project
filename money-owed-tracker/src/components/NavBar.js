import React from "react";
import { Link } from "react-router-dom";
class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
        }

    }

    logout = () => {
        localStorage.removeItem("signedin");
        this.setState({signedIn: localStorage.getItem("signedin")});
        window.location.href = '/';
    }

    render(){

        const checkSignedIn = () => {
        if (this.state.signedIn != null) {
            return (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <li style={{ marginLeft: "5px", marginRight: "5px"}}>{this.state.signedIn}</li>
                    <li style={{ marginLeft: "5px", marginRight: "5px"}} onClick={this.logout}><Link to="/">Logout</Link></li>
                </div>
                
            );
        } else {
            return (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/login">Login</Link></li>
                    <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/register">Register</Link></li>
                </div>
                
            );
        }
        }

        return (
            <div className="App">
                <ul style={{ listStyle: "none", display: "flex", justifyContent: "space-around" }}>
                    <li><Link to="/">Home</Link></li>
                    {checkSignedIn()}
                </ul>
            </div>

        )
    }
}


export default NavBar;