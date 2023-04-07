import React from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            passwordHidden: true,
            signedIn: localStorage.getItem("signedin"),
        }
    }
    passwordVisiblilty = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const password = document.getElementById('loginPassword');
        if (this.state.passwordHidden){
            this.setState({passwordHidden:false})
            password.type = 'text';

        } else {
            this.setState({passwordHidden:true})
            password.type = 'password';
        }
    }

    checkFilled = () => {
        const login = document.getElementById('loginSubmit');
        const username = document.getElementById('loginUsername');
        const password = document.getElementById('loginPassword');
        const message = document.getElementById('loginMessage');
        if (username.value.length > 0 && password.value.length > 0 && username.value !=' ' && password.value !=' '){
            login.disabled = false;
        } else {
            login.disabled = true;
        }
        message.innerHTML = '';
    }

    spacesMessage = (e) => {
        const message = document.getElementById('loginMessage');
        if(e.key === 'Enter'){
            e.preventDefault();
        }
        if(e.keyCode == 32){
            message.innerHTML = `${e.target.name} cannot contain spaces`;
            e.target.value = e.target.value.split(' ').join('');
        }
        if(e.key ==='-'){
            message.innerHTML = `${e.target.name} cannot contain hyphens`;
            e.target.value = e.target.value.split('-').join('');
        }
    }

    login = (e) => {
        e.preventDefault();
        const message = document.getElementById('loginMessage');
        const username = e.target.username.value;
        const password = e.target.password.value;

        // checking if username & password match database
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            message.innerHTML = data.message;
            if(data.submission === "successful"){
                e.target.username.value= "";
                e.target.password.value = "";
                e.target.login.disabled = true;
                window.location.href = '/';
                localStorage.setItem("signedin", data.user);
                localStorage.setItem("signedinID", data.id);
            }
        })
        .catch((err) => console.log(err))
    }

    // stopping password visiblity button being activated when clicking submit on input 
    prevent = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
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
        window.location.href = '/login';
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn === null) {
                return (
                <div>
                    <AccountBoxIcon style={{fontSize: '160px'}}/>
                    <h1>Login</h1>
                    <form onInput={this.checkFilled} onSubmit={this.login} >
                        <div>
                            <div className="labelWithIcon" style={{margin: '10px'}}>
                                < PersonIcon style={{marginRight: '4px', fontSize: '20px'}}/>
                                <label>Username</label>
                            </div>
                            <input type='text' id='loginUsername' onKeyUp= {this.spacesMessage} onKeyDown={this.prevent} name='username'></input>
                        </div>
                        <div>
                            <div className="labelWithIcon" style={{margin: '10px'}}>
                                < LockIcon style={{marginRight: '4px', fontSize: '16px'}}/>
                                <label>Password</label>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <input type='password' id='loginPassword' onKeyUp= {this.spacesMessage} onKeyDown={this.prevent} name='password' style={{marginRight: '8px'}}></input>
                                <button onClick = {this.passwordVisiblilty}>{this.state.passwordHidden? <div className="labelWithIcon">< VisibilityOffIcon style={{marginRight: '4px', fontSize: '16px'}}/>hidden</div>: <div className="labelWithIcon">< VisibilityIcon style={{marginRight: '4px', fontSize: '16px'}}/>visible</div>}</button>
                            </div>
                        </div>
                        <input name='login' type='submit' id='loginSubmit' value='Login' disabled onSubmit={this.login} style={{margin: '20px'}}/>
                    </form>
                    <p id="loginMessage"></p>
                </div>
                );
            } else {
                return (
                    <div>
                        <p>Already signed in. Logout to resign in</p>
                        <button onClick={this.logout}>logout</button>
                    </div>
                    
                );
            }
        }

        return(
            <div className="App">
               {checkSignedIn()}
            </div>
            
        )
    }
}
export default Login;