import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from './Icons/HomeIcon'
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ThreePIcon from '@mui/icons-material/ThreeP';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

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
                        <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/groups" className='navBarIcons'><GroupsIcon sx={{fontSize: '35px'}}/>All Groups</Link></li>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/create" className='navBarIcons'>< GroupAddIcon sx={{fontSize: '28px'}}/> Create New Group</Link></li>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/requests" className='navBarIcons'>< ThreePIcon sx={{fontSize: '26px'}}/> Group Requests</Link></li>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}} id='UsernameNavbar'><PersonIcon sx={{fontSize: '26px', mr: 1}}/>{this.state.signedIn}</li>
                        <li style={{ marginLeft: "5px", marginRight: "5px"}} onClick={this.logout}><Link to="/" className='navBarIcons'>< LogoutTwoToneIcon /> Logout</Link></li>
                    </div>
                </div>
                
                
            );
        } else {
            return (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/login" className='navBarIcons'><LoginTwoToneIcon />Login</Link></li>
                    <li style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/register" className='navBarIcons'><PersonAddAlt1Icon />Register</Link></li>
                </div>
                
            );
        }
        }

        return (
            <div className="App">
                <ul style={{ listStyle: "none", display: "flex", justifyContent: "center" }}>
                    <li><Link to="/" className='navBarIcons'><HomeIcon />Home</Link></li>
                    {checkSignedIn()}
                </ul>
            </div>

        )
    }
}


export default NavBar;