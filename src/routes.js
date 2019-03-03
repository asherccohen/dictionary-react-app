import React from 'react';

import { Route, Switch } from 'react-router-dom';

import App from './App';
import Dictionary from './views/Dictionary';
/* eslint-disable-next-line */
export const Routes = () => (
  <div>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/dictionary/:id" component={Dictionary} />
    </Switch>
  </div>
);
