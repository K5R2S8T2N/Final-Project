import React from "react";

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            passwordHidden: true,
            signedIn: localStorage.getItem("signedin"),
        }
    }
    passwordVisiblilty = (e) => {
        e.preventDefault();
        const password = document.getElementById('registerPassword');
        if (this.state.passwordHidden){
            this.setState({passwordHidden:false})
            password.type = 'text';

        } else {
            this.setState({passwordHidden:true})
            password.type = 'password';
        }
    }

    checkFilled = () => {
        const register = document.getElementById('registerSubmit');
        const username = document.getElementById('registerUsername');
        const password = document.getElementById('registerPassword');
        const message = document.getElementById('registerMessage');
        const userCount = username.value.length;
        const passCount = password.value.length;
        const usernameCount = document.getElementById('usernameCount');
        const passwordCount = document.getElementById('passwordCount');
        if (userCount > 0 && passCount > 0 && username.value !=' ' && password.value !=' ' && userCount <= 50 && passCount <= 50){
            register.disabled = false;
            usernameCount.innerHTML = '';
            passwordCount.innerHTML = '';
        } else {
            register.disabled = true;
            if (userCount > 50){
                usernameCount.innerHTML = "username too long";
            }
            if (passCount > 50){
                passwordCount.innerHTML = "password too long";
            }
        }
        message.innerHTML = '';

    }

    spacesMessage = (e) => {
        const message = document.getElementById('registerMessage');
        if(e.key === 'Enter'){
            e.preventDefault();
        }
        if(e.keyCode == 32){
            message.innerHTML = `${e.target.name} cannot contain spaces`;
            e.target.value = e.target.value.split(' ').join('');
        }
    }

    register = (e) => {
        e.preventDefault();
        const message = document.getElementById('registerMessage');
        const username = e.target.username.value;
        const password = e.target.password.value;

        // checking + inserting username into database 
        fetch('http://localhost:3000/register', {
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
                e.target.register.disabled = true;
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
        this.setState({signedIn: localStorage.getItem("signedin")});
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn === null) {
                return (
                <div>
                    <h1>Registration</h1>
                    <form onInput={this.checkFilled} onSubmit={this.register} >
                        <div>
                            <label>Username</label>
                            <input type='text' id='registerUsername' onKeyUp= {this.spacesMessage} onKeyDown={this.prevent} name='username'></input>
                            <p id="usernameCount"></p>
                        </div>
                        <div>
                            <label>Password</label>
                            <input type='password' id='registerPassword' onKeyUp= {this.spacesMessage} onKeyDown={this.prevent} name='password'></input>
                            <p id='passwordCount'></p>
                            <button onClick = {this.passwordVisiblilty}>{this.state.passwordHidden? "hidden" : "visible"}</button>
                        </div>
                        <input name='register' type='submit' id='registerSubmit' value='Register' disabled onSubmit={this.register}/>
                    </form>
                    <p id="registerMessage"></p>
                </div>
                );
            } else {
                return (
                    <div>
                        <p>Already signed in. Logout to register</p>
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
export default Register;