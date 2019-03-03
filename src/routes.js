import React from 'react';

import { Route, Switch } from 'react-router-dom';

/* import Layout from './components/Layout';
import Settings from './components/Settings'; */

/* eslint-disable-next-line */
/* import PrivateRoute from './containers/PrivateRoute'; */
/* eslint-disable-next-line */
import App from './App';
/* eslint-disable-next-line */
/* import Home from './containers/Home'; */
/* import Dashboard from './views/Dashboard'; */
import Dictionary from './views/Dictionary';
import NoMatchPage from './views/NoMatchPage';
/* eslint-disable-next-line */
export const Routes = () => (
  <div>
    <Switch>
      <Route exact path="/" component={App} />
      {/*       <Route exact path="/">
        <Redirect to="/Home" />
      </Route> */}
      {/* <Route exact path="/home" component={Dashboard} /> */}
      <Route exact path="/dictionary/:id" component={Dictionary} />
      {/* <PrivateRoute exact path="/dashboard" component={Dashboard} /> */}
      {/*         <PrivateRoute exact path="/expenses" component={ExpensesPage} />
        <PrivateRoute exact path="/expenses/new" component={ExpenseForm} />
        <PrivateRoute exact path="/expenses/edit/:id" component={ExpenseForm} />

        <PrivateRoute
          exact
          path="/bookKeeping/expenses"
          component={DownloadExpenses}
        />
        <PrivateRoute exact path="/invoices/list" component={InvoicesList} />
        <PrivateRoute exact path="/invoices/new" component={InvoiceForm} />
        <PrivateRoute exact path="/invoices/edit/:id" component={InvoiceForm} />
        <PrivateRoute
          exact
          path="/invoices/pdf/:id/:type"
          component={InvoicePdf}
          showDrawer={false}
        />
        <PrivateRoute
          exact
          path="/settings"
          component={Settings}
          restrictedFeature="CompanySettings"
        /> */}
      <Route component={NoMatchPage} />
    </Switch>
  </div>
);
