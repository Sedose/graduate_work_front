/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
import Welcome from './Welcome';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component<AuthComponentProps> {
  render() {
    const {
      error, isAuthenticated, login, logout, appLogin, user,
    } = this.props;

    return (
      <Router>
        <div>
          <NavBar
            isAuthenticated={isAuthenticated}
            login={login}
            logout={logout}
            appLogin={appLogin}
            user={user}
          />
          <Container>
            {error && (
              <ErrorMessage
                message={error.message}
                debug={error.debug}
              />
            )}
            <Route
              exact
              path="/"
              render={(props) => (
                <Welcome
                  {...props}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  authButtonMethod={login}
                />
              )}
            />
          </Container>
        </div>
      </Router>
    );
  }
}

export default withAuthProvider(App);
