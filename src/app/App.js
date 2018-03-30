import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import aws_exports from './aws-exports';

import Map from "./map/Map";
import Form from "./form/Form";

import "./App.css";

Amplify.configure(aws_exports);

class App extends Component {

  componentWillMount(){
    Amplify.Auth.currentAuthenticatedUser().then((user) => {
      console.log('user',user)
      const apigClient = window.apigClientFactory.newClient();
      const idJwtToken = user.signInUserSession.getIdToken().getJwtToken();
      apigClient.locationsGet(
        {},
        {},
        {
          headers : {
            Authorization : idJwtToken 
          }
        })
        .then((result) => console.log('result', result))
        .catch( (e) => console.log('error', e) )
      user.getUserAttributes((err, attributes) => {
        let o = {}; 
        attributes.forEach(x => o[x.Name] = x.Value)
        this.setState({user : o});
      })
    });
  }

  logout() {
    Amplify.Auth.signOut()
        .then(data => {
          window.location.reload();
        })
        .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        { this.state && this.state.user && 
          <p> 
            Hello {this.state.user.name}!&nbsp;
            <span onClick={() => this.logout()} style={{cursor : 'pointer', color : 'blue'}}>(Logout)</span>
          </p> 
        }
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Map} />
            <Route path="/form" component={Form} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default withAuthenticator(App);
