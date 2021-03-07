/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    <Typography paragraph variant="h6">
      Student main page
    </Typography>
    <Typography paragraph variant="h6">
      Welcome, student
    </Typography>
    <Button><Link to="register-coordinates">Register coordinates</Link></Button>
  </div>
);
