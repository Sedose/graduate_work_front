import React from 'react';
import { Button, Jumbotron } from 'reactstrap';

interface WelcomeProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

const WelcomeContent = ({
  isAuthenticated,
  user,
  authButtonMethod,
}: WelcomeProps) => (isAuthenticated && (
<div>
  <h4>
    Welcome, {user.displayName}!
  </h4>
  <p>Use the navigation bar at the top of the page to get started.</p>
</div>
)) || (
<Button color="primary" onClick={authButtonMethod}>
  Click here to sign in
</Button>
);

export default ({ isAuthenticated, user, authButtonMethod }: WelcomeProps) => (
  <Jumbotron>
    <h1>Student attendance management system</h1>
    <p className="lead">This app is for lecturers, students</p>
    <WelcomeContent
      isAuthenticated={isAuthenticated}
      user={user}
      authButtonMethod={authButtonMethod}
    />
  </Jumbotron>
);
