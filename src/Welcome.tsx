/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

const Welcome = ({ isAuthenticated, user, authButtonMethod }: WelcomeProps) => (
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

export default Welcome;
