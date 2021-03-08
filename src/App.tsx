/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import styled from 'styled-components';
import withAuthProvider from './component/AuthProvider';
import NavBar from './component/NavBar';
import ErrorMessage from './component/ErrorMessage';
import Welcome from './pages/Welcome';
import 'bootstrap/dist/css/bootstrap.css';
import StudentMainPage from './pages/student/StudentMainPage';
import LecturerMainPage from './pages/lecturer/LecturerMainPage';
import TrainingRepresentativeMainPage from './pages/training-representative/TrainingRepresentativeMainPage';
import Copyright from './component/Copyright';
import RegisterProvidingFilesPage from './pages/lecturer/RegisterProvidingFilesPage';

const PageDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = styled.footer`
  margin-bottom: auto;
`;

const App = ({
  error, isAuthenticated, login, logout, appLogin, user, getAccessToken,
}) => (
  <Router>
    <PageDiv>
      <NavBar
        isAuthenticated={isAuthenticated}
        login={login}
        logout={logout}
        appLogin={appLogin}
        user={user}
      />
      <Container>
        {(error.message || error.debug) > 0 && (
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
        <Route
          exact
          path="/student-main-page"
          render={() => (
            <StudentMainPage />
          )}
        />
        <Route
          exact
          path="/lecturer-main-page"
          render={() => (
            <LecturerMainPage />
          )}
        />
        <Route
          exact
          path="/training-representative-main-page"
          render={() => (
            <TrainingRepresentativeMainPage />
          )}
        />
        <Route
          exact
          path="/register/providing-files"
          render={() => (
            <RegisterProvidingFilesPage getAccessToken={getAccessToken} />
          )}
        />
      </Container>
      <Footer>
        <Copyright />
      </Footer>
    </PageDiv>
  </Router>
);

export default withAuthProvider(App);
