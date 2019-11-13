import React from 'react';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';

import { Logs, Pipeline } from '../pages';

export default () => <Switch>
    <Route exact path="/" render={() => <Redirect to="/logs"/>} />
    <Route exact path="/logs" component={Logs} />
    <Route exact path="/run-pipeline" component={Pipeline} />
</Switch>

