import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import history from '../history/History';
import '../common/css/main.css';
import '../common/css/animation.css';
import 'semantic-ui-css/semantic.min.css';
import Layout from './Layout';
import Login from "../containers/Login";

class App extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/index" component={Login} />;
                    <Route path="/" component={Layout} />;
                </Switch>
            </Router>
        )
    }
}

export default App;
