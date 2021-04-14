import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import styled from 'styled-components';
import withAuthProvider from './AuthProvider';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
import Welcome from './pages/Welcome';
import 'bootstrap/dist/css/bootstrap.css';
import StudentMainPage from './pages/student/StudentMainPage';
import LecturerMainPage from './pages/lecturer/LecturerMainPage';
import TrainingRepresentativeMainPage from './pages/training-representative/TrainingRepresentativeMainPage';
import Copyright from './Copyright';
import RegisterProvidingFilesPage from './pages/lecturer/RegisterProvidingFilesPage';

const PageDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = styled.footer`
  margin-bottom: auto;
`;

interface Props {
  error: any,
  isAuthenticated: boolean,
  login: Function,
  logout: Function,
  appLogin: Function,
  user: any,
  getAccessToken: Function
}

const FlexContainer = styled(Container)`
`;

const App = ({
  error, isAuthenticated, login, logout, appLogin, user, getAccessToken,
}: Props) => (
  <Router>
    <PageDiv>
      <NavBar
        isAuthenticated={isAuthenticated}
        login={login}
        logout={logout}
        appLogin={appLogin}
        user={user}
      />
      <FlexContainer>
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
      </FlexContainer>
      <Footer>
        <Copyright />
      </Footer>
    </PageDiv>
  </Router>
);

export default withAuthProvider(App);