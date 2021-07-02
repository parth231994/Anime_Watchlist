import React, { useState } from 'react'
import './login.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

function Login(props){
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [message, setMessage] = useState('Please Login')

    const setUser = props.setUser
    const setJwt = props.setJwt

    const auth = async (name, password) => {
        const baseUrl = props.baseUrl
        setMessage('logging in...')
        try{
            const response = await fetch(baseUrl+'/user/login', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({name, password})
            })
            const respJson = await response.json()
            if(response.status === 200)
            {
                setUser(name)
                localStorage.setItem('name', name)
                setJwt(respJson.token)
                localStorage.setItem('jwt', respJson.token)
            } else {
                setMessage('Unable to login. Either the Account does not exist, or you entered the wrong password.')
            }
        } catch(err){
            setMessage('Unable to Login. Please try again later.')
            console.log(err)
        }
    }

    const register = async (name, password) => {
        const baseUrl = props.baseUrl
        setMessage('Creating new Account...')
        try{
            const response = await fetch(baseUrl+'/user', {
                method: 'POST',
                mode: 'cors',
                cache:'no-cache',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({name, password})
            })
            const respJson = await response.json()

            if(response.status === 200)
            {
                setUser(name)
                localStorage.setItem('name', name)
                setJwt(respJson.token)
                localStorage.setItem('jwt', respJson.token)
            } else {
                setMessage('Unable to create new Account. Username already taken!')
            }
        } catch(err){
            setMessage('Unable to create new Account. Please try again later.')
            console.log(err)
        }
    }

    return(
    <div    className="col-md-6 col-md-offset-4 text-center" 
            style={{padding: '12%', 
                    marginLeft: '25%'}} >
      <h2>Login</h2>
      {/* Main Form */}
      <div id='login-form'>
        <p>{message}</p>
        <TextField 
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoComplete='username'
            autoFocus
            onChange= {(e)=> setUsername(e.target.value)}
        />
        <TextField 
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='password'
            name='password'
            label='Password'
            type='password'
            autoComplete='password'
            onChange={(e)=> setPassword(e.target.value)}
        />
        <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            onClick={()=> auth(username, password)}
        >Login</Button>
        
        <Button
            type='submit'
            fullWidth
            variant='contained'
            color='default'
            onClick={()=> register(username, password)}
        >Register</Button>
      </div>
    </div>
    )
}

export default Login