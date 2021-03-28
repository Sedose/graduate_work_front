import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Jumbotron } from 'reactstrap';

export default () => (
  <div>
    <Jumbotron paragraph variant="h6">
      Student main page
    </Jumbotron>
    <Jumbotron paragraph variant="h6">
      Welcome, student
    </Jumbotron>
    <Button><Link to="register-coordinates">Register coordinates</Link></Button>
  </div>
);
