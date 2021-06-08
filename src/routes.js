import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from './history'

import Screen1 from './pages/screen1';
import Screen2 from './pages/screen2';
import Screen3 from './pages/screen3';
import Screen4 from "./pages/screen4";

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Screen1} />
                    <Route path="/otpverify" component={Screen2} />
                    <Route path="/vaccinedetails" component={Screen3}/>
                    <Route path="/booking" component={Screen4}/>
                </Switch>
            </Router>
        )
    }
}