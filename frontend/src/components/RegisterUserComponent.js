import React, { Component } from 'react';
import axios from 'axios';
import { isEmpty } from 'lodash';


class RegisterUser extends Component {
constructor(props){
    super(props)
    this.state = {
        form: {
            username:"",
            password:""
        },
        errors:{}
    }
}

handlOnChange = (event) =>{
    this.setState({form:{...this.state.form,[event.target.name]: event.target.value}})
}

handleSubmit = (event) => {
    event.preventDefault();

    const {errors} = this.state;
    const {username, password} = this.state.form;

    if(isEmpty(username)){
        errors.username = true;
        errors.usernameMessage = "This field is required";
    }
    
    if(!isEmpty(username) && (username.length < 3)){
        errors.username = true;
        errors.usernameMessage = "This field requires min 3 characters";
    }


    if(isEmpty(password)){
        errors.password = true;
        errors.passwordMessage = "This field is required";
    }

    if(!isEmpty(password) && password.length < 8){
        errors.password = true;
        errors.passwordMessage = "This field requires min 8 characters";
    }

    this.setState({ errors });
    if(!isEmpty(username) && !isEmpty(password)){
        let data ={
            name: username,
            password: password
        }
        
        const apiUrl = 'http://localhost:3000/user';

    fetch(apiUrl,{
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) =>{
        if(data.token){
          localStorage.setItem('JwtToken', data.token);
          console.log('This is your data', data);
          this.props.history.push('/home');
        }
      });
      
    }    

}

handleCancel = () =>{
    // e.preventDefault();
    this.setState({
            form: {
                username:"",
                password:""
            },
            errors:{}
    })
}

    render(){

    const { errors, form } = this.state
    return(
      <div class="cen-container">
      <div className="col-md-6 col-md-offset-4 text-center" style={{padding: '12%', marginLeft: '25%'}}>
      <h2>Register</h2>
      {/* Main Form */}
      <div className="login-form-1">
        <form id="register-form" className="text-left" onSubmit={this.handleSubmit}>
          <div className="login-form-main-message" />
          <div className="main-login-form">
            <div className="login-group">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" value={form.username} className="form-control" id="username" name="username" placeholder="Enter your Username" onChange={this.handlOnChange} />
              </div>

              {errors.username && errors.usernameMessage && (
                    <div class="alert alert-danger" role="alert"> {errors.usernameMessage} </div>
                )}

              <div className="form-group">
                <label htmlFor="reg_password" >Password</label>
                <input type="password" value={form.password} className="form-control" id="password" name="password" placeholder="Enter your Password" onChange={this.handlOnChange}/>
              </div>
              
                {errors.password && errors.passwordMessage && (
                    <div class="alert alert-danger" role="alert"> {errors.passwordMessage} </div>
                )}

            {/* <button type="submit" className="login-button"><i className="fa fa-chevron-right" /></button> */}
            <button type="submit" className="btn btn-primary">Register</button>
            <button type="button" className="btn btn-secondary"  style={{marginLeft: '50%'}} onClick={() =>this.handleCancel()}>Cancel</button>
            

          </div>
          </div>
          
        </form>
      </div>
    </div>
    </div>
        );
    }
}

export default RegisterUser;

