import React from "react";
import GroupRequestsMembersPopper from "./GroupRequestsMembersPopper";
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

class Requests extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
        }
    }
    componentDidMount(){
        this.checkRequests();
    }

    checkRequests = async () => {
        const response = await fetch('http://localhost:3000/loadRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.state.signedInId,
            }),
        });
        const responseJ = await response.json();
        const responseJArr = responseJ.info;
        responseJArr.forEach((request) => {
            const name = request[0];
            const creator = request[1];
            // get ids of other members of request group
            fetch('http://localhost:3000/loadOtherMembersIds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    creator: creator,
                }),
            }).then((res) => {
                return res.json()
            })
            .then((data) => {
                request.push(data.otherMembersId);
            });
        })
        this.setState({groupRequests: responseJArr});
    }

    respondRequest = async (e) => {
        const requestMessage = document.getElementById('requestMessage');
        const requestTypeArr = e.target.id.split('-');
        const response = await fetch('http://localhost:3000/requestResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                response: requestTypeArr[0],
                name: requestTypeArr[1],
                creator: requestTypeArr[2],
                userResponding: localStorage.getItem("signedinID"),

            }),
        });
        const responseJ = await response.json();
        requestMessage.innerHTML = `group "${responseJ[0].group_name}" ${responseJ[0].status}`;
        this.checkRequests();
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                    <div>
                        <h3>Requests Page</h3>
                        <p id="requestMessage"></p>
                        <div id="requestsList">{
                            this.state.groupRequests && this.state.groupRequests.map( (request, index) => {
                                return  (
                                    <div className='requests' key={`${request[0]}-${request[1]}`}>
                                        <div>
                                            <p> group name: {request[0]}</p>
                                            <p> made by: {request[1]}</p>
                                        </div>
                                        
                                        <div id='requestsButtonsDiv'> 
                                            <button id={`accepted-${request[0]}-${request[1]}`} onClick={this.respondRequest}>accept</button>
                                            <button id={`declined-${request[0]}-${request[1]}`} onClick={this.respondRequest}>decline</button>
                                            <GroupRequestsMembersPopper information={`otherusers-${index}`} requestsInfo={this.state.groupRequests}/>
                                        </div>
                                    </div>
                                )
                            })
                        }</div>
                    </div>
                );

            } else {
                return (
                    <div>
                        <p>Sign in to view requests</p>
                    </div>
                    
                );
            }
        }

        return(
            <div>
               {checkSignedIn()}
            </div>
        )
    }
}
export default Requests;