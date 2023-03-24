import React from "react";

class Groups extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
        }
    }
    componentDidMount(){
        const signedIn = localStorage.getItem("signedin");
    }
    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return <p>this is the groups page</p>;
            } else {
                return (
                    <div>
                        <p>Sign in to view groups</p>
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
export default Groups;