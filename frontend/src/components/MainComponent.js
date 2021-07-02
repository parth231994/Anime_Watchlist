import React, { Component } from 'react';
import Home from './HomeComponent';
import RegisterUser from './RegisterUserComponent';
import LoginUser from './LoginUserComponent';


import { Switch, Route, Redirect} from 'react-router-dom';


class Main extends Component {
   
    render() {
      const HomePage = () => {
          return ( <Home /> );
    }
        return (
          <div>
            {/* <Header /> */}
            <Switch>
              <Route exact path="/" render= {() => { return ( <Redirect to = "/create/user" /> )} } />
              <Route exact path="/home" component={HomePage} />
              <Route exact path="/create/user" component={RegisterUser} />
              <Route exact path="/login" component={LoginUser} />

              <Route to="/home" />

            </Switch>
            {/* <Footer /> */}
          </div>
        );
    }
}        
export default Main;
