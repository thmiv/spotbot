import React from "react";
import {withRouter} from 'react-router';
import { Route, Redirect } from "react-router-dom";
import Game from "./pages/Game";
import Callback from "./pages/Callback";
import Homepage from "./pages/Homepage";
import Waitingroom from "./pages/Waitingroom";


const App = props => {

  return (
    <div className="container">
      {/* <Route path="/callback" render={() => (
        <Callback auth={props.auth} />
      )} /> */}
      <Route exact path="/" render={() => {
        return (
          <Homepage  />
        ) }} />
      <Route exact path="/game" render={() => {
        return (
          <Game history={props.history} />
        ) }} />
      <Route exact path="/waitingroom" render={() => {
        return (
          <Waitingroom history={props.history} />
        ) }} />
    </div>
  )
}

export default withRouter(App);