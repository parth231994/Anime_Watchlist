import React, { useState } from 'react'
import '../App.css'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'


function UserInfo(props){
    const user = props.user
    const token = props.token
    const setUser = props.setUser
    const setJwt = props.setJwt

    const logout = async () => {
        const baseUrl = props.baseUrl
        try{
            await fetch(baseUrl+'/user/logout', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            setUser(null)
            setJwt(null)
            localStorage.removeItem('jwt')
        } catch (err){
            console.log(err)
        }
    }
    
    return (
        <div id="user-info">
                <AppBar position="static" >
                <Typography variant="h6" >
                    <h2> Welcome {user}</h2> 
                    </Typography>    
                </AppBar>
                <Button consta color="primary" size="small" onClick={()=>logout()  }>Logout  </Button>
            
                 
        </div>
    )
}

export default UserInfo