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
import ActiveGroups from "./ActiveGroups";
import Button from '@mui/material/Button';

class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
            
        }

    }

    notRun = true;
    componentDidMount(){
        if(this.notRun){
            this.checkGroups();
        }  
    }

    logout = () => {
        localStorage.removeItem("signedin");
        localStorage.removeItem("signedinID");
        localStorage.removeItem("groupName");
        localStorage.removeItem("groupCreator");
        localStorage.removeItem("groupStatus");
        localStorage.removeItem("groupMembers");
        localStorage.removeItem("navBarRerender");
        this.setState({signedIn: localStorage.getItem("signedin")});
        window.location.href = '/';
    }

    checkGroups = async () => {
        this.notRun = false;
        const response = await fetch('http://localhost:3000/loadGroups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.state.signedInId,
            }),
        });
        const responseJ = await response.json();
        const groupsInfo = responseJ.groups;
        let groupsProcessed = 0;
        groupsInfo.forEach( async (group, index, arr) => {
            const getGroupStatus = await fetch('http://localhost:3000/getGroupStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: group[0],
                    creator: group[1],
                }),
            });
            const getGroupStatusJ = await getGroupStatus.json();
            let stat = 'invalid';

            getGroupStatusJ.usersStatusInfo.forEach( (status) => {
                if (status === 'accepted'){
                    stat = 'active';
                }
            });
            getGroupStatusJ.usersStatusInfo.forEach( (status) => {
                if (status === 'requested'){
                    stat = 'pending';
                }
            });
            group.push(stat);
            groupsProcessed++;
            if(groupsProcessed === arr.length){
                this.setState({groupsList: groupsInfo});
            }
        });
    }

    openGroup = (e) => {
        e.stopPropagation();
        const groupInfoArr = e.target.id.split('-');
            console.log('openning');
            localStorage.setItem("groupName", groupInfoArr[1]);
            localStorage.setItem("groupCreator", groupInfoArr[2]);
            localStorage.setItem("groupStatus", groupInfoArr[3]);
            fetch('http://localhost:3000/openGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupName: groupInfoArr[1],
                    groupCreator: groupInfoArr[2],
                    status: groupInfoArr[3],
                }),
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if(data.submission === "pending"){
                    window.location.href = '/openpending';
                } else{
                    window.location.href = '/opengroup';
                }
            })
            .catch((err) => console.log(err))
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                    <div id='navBarNotInclHome'> 
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
                            <div style={{marginRight: '80px'}}><Link to="/" className='navBarIcons'><HomeIcon />Home</Link></div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderLeft: '4px solid purple', borderRadius: '4px', padding: '5px 10px 5px 20px', backgroundColor: 'rgb(205, 171, 212)'}}>
                                {this.state.groupsList? <div style={{ marginRight: "20px", display: 'flex', alignItems: 'flex-end' }}><ActiveGroups openGroup={this.openGroup} signedIn={this.state.signedIn} groupsList={this.state.groupsList} resetting={this.checkGroups}/></div> : <></>}
                                <Button style={{ marginLeft: '5px', marginRight: '20px', paddingBottom: '0px'}}><Link to="/groups" className='navBarIcons lighterPurpleIcons'><GroupsIcon sx={{fontSize: '35px'}}/>All Groups</Link></Button>
                                <Button style={{ marginLeft: "5px", marginRight: "20px", paddingBottom: '0px'}}><Link to="/create" className='navBarIcons lighterPurpleIcons'>< GroupAddIcon sx={{fontSize: '28px', paddingTop: '8px'}}/> Create New Group</Link></Button>
                                <Button style={{ marginLeft: "5px", marginRight: "5px", paddingBottom: '0px'}}><Link to="/requests" className='navBarIcons lighterPurpleIcons'>< ThreePIcon sx={{fontSize: '26px', paddingTop: '8px'}}/> Group Requests</Link></Button>
                            </div>
                            
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ marginLeft: "5px", marginRight: "5px"}} id='UsernameNavbar'><PersonIcon sx={{fontSize: '26px', mr: 1}}/>{this.state.signedIn}</div>
                            <div style={{ marginLeft: "5px", marginRight: "5px"}} onClick={this.logout}><Link to="/" className='navBarIcons'>< LogoutTwoToneIcon /> Logout</Link></div>
                        </div>
                    </div>
                    
                    
                );
            } else {
                return (
                    <div id='navBarNotInclHome'>
                        <div><Link to="/" className='navBarIcons'><HomeIcon />Home</Link></div>
                        <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/login" className='navBarIcons'><LoginTwoToneIcon />Login</Link></div>
                            <div style={{ marginLeft: "5px", marginRight: "5px"}}><Link to="/register" className='navBarIcons'><PersonAddAlt1Icon />Register</Link></div>
                        </div>

                    </div>
                    
                );
            }
        }

        return (
            <div className="App" id='navBarContainer'>
                {checkSignedIn()}
            </div>

        )
    }
}


export default NavBar;