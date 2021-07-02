import React, { useState } from 'react'
import './App.css'

import Login from './components/login'
import Watchlist from './components/watchlist'
import UserInfo from './components/user-info'

function App() {
  const [user, setUser] = useState({name: null})
  const [jwt, setJwt] = useState()

  const baseUrl = 'http://localhost:3000'

  if(localStorage.getItem('jwt') !== undefined && jwt === undefined){
    setJwt(localStorage.getItem('jwt'))
    setUser(localStorage.getItem('name'))
  }
  
  // already logged in
  if(user && jwt){
    return(
      <div id="App">
        <UserInfo setUser={setUser} setJwt={setJwt} user={user} token={jwt} baseUrl={baseUrl} />
        <Watchlist token={jwt} baseUrl={baseUrl} />
      </div>
    )
  } // not logged in 
  else {
    return(
      <div className="App">
        <Login setUser={setUser} setJwt={setJwt} baseUrl={baseUrl} />
      </div>
    )
  }
}
  
export default App
