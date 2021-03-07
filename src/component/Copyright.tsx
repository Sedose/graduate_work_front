/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import Typography from '@material-ui/core/Typography';
import React from 'react';

const styles = {
  margin: 10,
};

export default () => (
  <div>
    <Typography style={styles} variant="body2" color="textSecondary" align="center">
      {`Copyright © Online log of visits ${new Date().getFullYear()}`}
    </Typography>
  </div>
);
