import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Logs, Pipeline } from '../pages';

export default () => {
    return  (
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/logs"/>} />
            <Route exact path="/logs" component={Logs} />
            <Route exact path="/pipeline" component={Pipeline} />
        </Switch>
    )
}
