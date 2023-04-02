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
        localStorage.removeItem("signedinID");
        localStorage.removeItem("groupName");
        localStorage.removeItem("groupCreator");
        localStorage.removeItem("groupStatus");
        localStorage.removeItem("groupMembers");
        this.setState({signedIn: localStorage.getItem("signedin")});
        window.location.href = '/';
    }

    render(){

        const checkSignedIn = () => {
        if (this.state.signedIn != null) {
            return (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "200px", marginRight: "200px" }}>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/groups">All Groups</Link></li>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/create">Create New Group</Link></li>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/requests">Group Requests</Link></li>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}}>{this.state.signedIn}</li>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}} onClick={this.logout}><Link to="/">Logout</Link></li>
                    </div>
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
                <ul style={{ listStyle: "none", display: "flex", justifyContent: "center" }}>
                    <li><Link to="/">Home</Link></li>
                    {checkSignedIn()}
                </ul>
            </div>

        )
    }
}


export default NavBar;